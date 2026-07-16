/*
# Airtable publication bridge

Adds stable Airtable identifiers, explicit publication state, safe access controls,
and synchronization observability without changing the original migration history.
*/

ALTER TABLE buyers
  ADD COLUMN IF NOT EXISTS airtable_record_id text,
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS publish_on_site boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS contact_route_url text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_buyers_airtable_record_id
  ON buyers(airtable_record_id)
  WHERE airtable_record_id IS NOT NULL;

ALTER TABLE records
  ADD COLUMN IF NOT EXISTS airtable_record_id text,
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS access_level text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS wedge text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_records_airtable_record_id
  ON records(airtable_record_id)
  WHERE airtable_record_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_records_publication
  ON records(is_published, access_level, date DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'records_access_level_check'
  ) THEN
    ALTER TABLE records
      ADD CONSTRAINT records_access_level_check
      CHECK (access_level IN ('free', 'paid'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS record_buyers (
  record_id text NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  buyer_id text NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  is_primary boolean NOT NULL DEFAULT false,
  PRIMARY KEY (record_id, buyer_id)
);

ALTER TABLE record_buyers ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL DEFAULT 'airtable',
  dry_run boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  buyers_fetched integer NOT NULL DEFAULT 0,
  records_fetched integer NOT NULL DEFAULT 0,
  buyers_upserted integer NOT NULL DEFAULT 0,
  records_upserted integer NOT NULL DEFAULT 0,
  buyers_unpublished integer NOT NULL DEFAULT 0,
  records_unpublished integer NOT NULL DEFAULT 0,
  validation_errors jsonb NOT NULL DEFAULT '[]',
  error_message text
);

ALTER TABLE sync_runs ENABLE ROW LEVEL SECURITY;

-- The service-role key used by the Edge Function bypasses RLS. Browser clients
-- receive only records explicitly published at the free access level.
DROP POLICY IF EXISTS "public_read_buyers" ON buyers;
CREATE POLICY "public_read_published_buyers" ON buyers FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_buyers" ON buyers;
DROP POLICY IF EXISTS "auth_update_buyers" ON buyers;
DROP POLICY IF EXISTS "auth_delete_buyers" ON buyers;

DROP POLICY IF EXISTS "public_read_records" ON records;
CREATE POLICY "public_read_free_published_records" ON records FOR SELECT
  TO anon, authenticated
  USING (
    is_published = true
    AND access_level = 'free'
    AND locked = false
  );

DROP POLICY IF EXISTS "auth_insert_records" ON records;
DROP POLICY IF EXISTS "auth_update_records" ON records;
DROP POLICY IF EXISTS "auth_delete_records" ON records;

CREATE POLICY "public_read_published_record_buyers" ON record_buyers FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM records
      WHERE records.id = record_buyers.record_id
        AND records.is_published = true
        AND records.access_level = 'free'
        AND records.locked = false
    )
  );
