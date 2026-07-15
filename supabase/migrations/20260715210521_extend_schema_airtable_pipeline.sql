/*
# Extend schema for Airtable publication pipeline

This migration adds columns and tables needed for the one-way
Airtable → Supabase → public website synchronization pipeline.

1. Modified Tables
  - `buyers`
    - `airtable_record_id` (text, unique when non-null) — Airtable row reference
    - `is_published` (boolean, default false) — whether row is publicly visible
    - `publish_on_site` (boolean, default false) — mirrors Airtable gate
    - `contact_route_url` (text, nullable) — separate URL field for contact route
  - `records`
    - `airtable_record_id` (text, unique when non-null) — Airtable row reference
    - `is_published` (boolean, default false) — whether row is publicly visible
    - `access_level` (text, default 'free') — constrained to free/paid
    - `published_at` (timestamptz, nullable) — when record was first published
    - `wedge` (text, nullable) — editorial wedge classification

2. New Tables
  - `record_buyers` — junction linking records to buyers (many-to-many)
    - `record_id` (text, FK to records, on delete cascade)
    - `buyer_id` (text, FK to buyers, on delete cascade)
    - `is_primary` (boolean, default false)
    - Primary key: (record_id, buyer_id)
  - `sync_runs` — audit log for every sync invocation
    - `id` (uuid, primary key)
    - `source` (text, not null)
    - `dry_run` (boolean, not null)
    - `started_at` (timestamptz)
    - `completed_at` (timestamptz)
    - `buyers_fetched` (integer)
    - `records_fetched` (integer)
    - `buyers_upserted` (integer)
    - `records_upserted` (integer)
    - `buyers_unpublished` (integer)
    - `records_unpublished` (integer)
    - `validation_errors` (jsonb)
    - `error_message` (text)

3. Security Changes
  - Replace existing write policies on `buyers` and `records` with restricted public-read
  - `buyers`: SELECT only when is_published = true (anon + authenticated)
  - `records`: SELECT only when is_published = true AND access_level = 'free' AND locked = false
  - `record_buyers`: SELECT only when linked record is publicly visible
  - `sync_runs`: no public policy (service-role only)

4. Important Notes
  - All changes are additive; no columns or tables are dropped.
  - Existing demo rows keep is_published = false and remain invisible via
    public RLS once live data is active — the frontend falls back to demo data
    when Supabase returns empty results.
  - The Edge Function uses service-role key which bypasses RLS.
*/

-- ============================================================
-- BUYERS: add columns
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='buyers' AND column_name='airtable_record_id') THEN
    ALTER TABLE buyers ADD COLUMN airtable_record_id text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='buyers' AND column_name='is_published') THEN
    ALTER TABLE buyers ADD COLUMN is_published boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='buyers' AND column_name='publish_on_site') THEN
    ALTER TABLE buyers ADD COLUMN publish_on_site boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='buyers' AND column_name='contact_route_url') THEN
    ALTER TABLE buyers ADD COLUMN contact_route_url text;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_buyers_airtable_record_id
  ON buyers(airtable_record_id) WHERE airtable_record_id IS NOT NULL;

-- ============================================================
-- RECORDS: add columns
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='records' AND column_name='airtable_record_id') THEN
    ALTER TABLE records ADD COLUMN airtable_record_id text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='records' AND column_name='is_published') THEN
    ALTER TABLE records ADD COLUMN is_published boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='records' AND column_name='access_level') THEN
    ALTER TABLE records ADD COLUMN access_level text NOT NULL DEFAULT 'free';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='records' AND column_name='published_at') THEN
    ALTER TABLE records ADD COLUMN published_at timestamptz;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='records' AND column_name='wedge') THEN
    ALTER TABLE records ADD COLUMN wedge text;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_records_airtable_record_id
  ON records(airtable_record_id) WHERE airtable_record_id IS NOT NULL;

ALTER TABLE records DROP CONSTRAINT IF EXISTS records_access_level_check;
ALTER TABLE records ADD CONSTRAINT records_access_level_check
  CHECK (access_level IN ('free', 'paid'));

-- ============================================================
-- RECORD_BUYERS junction table
-- ============================================================
CREATE TABLE IF NOT EXISTS record_buyers (
  record_id text NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  buyer_id text NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  is_primary boolean NOT NULL DEFAULT false,
  PRIMARY KEY (record_id, buyer_id)
);

ALTER TABLE record_buyers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SYNC_RUNS audit table
-- ============================================================
CREATE TABLE IF NOT EXISTS sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'airtable',
  dry_run boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  buyers_fetched integer DEFAULT 0,
  records_fetched integer DEFAULT 0,
  buyers_upserted integer DEFAULT 0,
  records_upserted integer DEFAULT 0,
  buyers_unpublished integer DEFAULT 0,
  records_unpublished integer DEFAULT 0,
  validation_errors jsonb DEFAULT '[]',
  error_message text
);

ALTER TABLE sync_runs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS: Drop old permissive policies, apply restricted ones
-- ============================================================

-- BUYERS: remove old write policies + old public read
DROP POLICY IF EXISTS "public_read_buyers" ON buyers;
DROP POLICY IF EXISTS "auth_insert_buyers" ON buyers;
DROP POLICY IF EXISTS "auth_update_buyers" ON buyers;
DROP POLICY IF EXISTS "auth_delete_buyers" ON buyers;

CREATE POLICY "public_read_published_buyers" ON buyers FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- RECORDS: remove old write policies + old public read
DROP POLICY IF EXISTS "public_read_records" ON records;
DROP POLICY IF EXISTS "auth_insert_records" ON records;
DROP POLICY IF EXISTS "auth_update_records" ON records;
DROP POLICY IF EXISTS "auth_delete_records" ON records;

CREATE POLICY "public_read_published_records" ON records FOR SELECT
  TO anon, authenticated USING (is_published = true AND access_level = 'free' AND locked = false);

-- RECORD_BUYERS: readable only when linked record passes public conditions
DROP POLICY IF EXISTS "public_read_record_buyers" ON record_buyers;
CREATE POLICY "public_read_record_buyers" ON record_buyers FOR SELECT
  TO anon, authenticated USING (
    EXISTS (
      SELECT 1 FROM records
      WHERE records.id = record_buyers.record_id
        AND records.is_published = true
        AND records.access_level = 'free'
        AND records.locked = false
    )
  );

-- SYNC_RUNS: no public policy (service-role bypasses RLS)
