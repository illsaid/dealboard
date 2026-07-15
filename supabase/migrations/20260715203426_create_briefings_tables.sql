/*
# Create briefings table and related child tables

1. New Tables
  - `briefings` — the main briefing issue
    - `id` (text, primary key) — e.g. 'issue-prototype'
    - `date` (date, not null) — publication date
    - `issue_label` (text, not null) — display label e.g. 'Prototype Issue - July 2026'
    - `headline` (text, not null)
    - `deck` (text, not null) — subheadline
    - `signal_this_week` (text, not null) — editorial signal paragraph
    - `money_moves` (text[], not null) — ordered array of record IDs (confirmed deals only)
    - `legacy_crossovers` (text[], not null) — ordered array of record IDs
    - `buyer_to_watch` (text, not null) — buyer_id reference
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  - `briefing_mandates` — developing signals for a briefing
    - `id` (uuid, primary key)
    - `briefing_id` (text, FK to briefings)
    - `position` (integer, not null) — display order
    - `signal_type` (text, not null)
    - `confidence` (text, not null)
    - `explanation` (text, not null)
    - `why_it_matters` (text, not null)
    - `evidence_url` (text, not null)

  - `briefing_quick_cuts` — short news items for a briefing
    - `id` (uuid, primary key)
    - `briefing_id` (text, FK to briefings)
    - `position` (integer, not null) — display order
    - `headline` (text, not null)
    - `summary` (text, not null)
    - `source_url` (text, not null)

2. Security
  - Enable RLS on all tables.
  - Public read access (anon + authenticated SELECT).
  - Authenticated-only write access.
*/

CREATE TABLE IF NOT EXISTS briefings (
  id text PRIMARY KEY,
  date date NOT NULL,
  issue_label text NOT NULL,
  headline text NOT NULL,
  deck text NOT NULL DEFAULT '',
  signal_this_week text NOT NULL DEFAULT '',
  money_moves text[] NOT NULL DEFAULT '{}',
  legacy_crossovers text[] NOT NULL DEFAULT '{}',
  buyer_to_watch text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_briefings" ON briefings;
CREATE POLICY "public_read_briefings" ON briefings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_briefings" ON briefings;
CREATE POLICY "auth_insert_briefings" ON briefings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_briefings" ON briefings;
CREATE POLICY "auth_update_briefings" ON briefings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_briefings" ON briefings;
CREATE POLICY "auth_delete_briefings" ON briefings FOR DELETE
  TO authenticated USING (true);

-- Mandates Forming child table
CREATE TABLE IF NOT EXISTS briefing_mandates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id text NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  signal_type text NOT NULL,
  confidence text NOT NULL,
  explanation text NOT NULL,
  why_it_matters text NOT NULL DEFAULT '',
  evidence_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_briefing_mandates_briefing ON briefing_mandates(briefing_id, position);

ALTER TABLE briefing_mandates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_briefing_mandates" ON briefing_mandates;
CREATE POLICY "public_read_briefing_mandates" ON briefing_mandates FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_briefing_mandates" ON briefing_mandates;
CREATE POLICY "auth_insert_briefing_mandates" ON briefing_mandates FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_briefing_mandates" ON briefing_mandates;
CREATE POLICY "auth_update_briefing_mandates" ON briefing_mandates FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_briefing_mandates" ON briefing_mandates;
CREATE POLICY "auth_delete_briefing_mandates" ON briefing_mandates FOR DELETE
  TO authenticated USING (true);

-- Quick Cuts child table
CREATE TABLE IF NOT EXISTS briefing_quick_cuts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id text NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  headline text NOT NULL,
  summary text NOT NULL DEFAULT '',
  source_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_briefing_quick_cuts_briefing ON briefing_quick_cuts(briefing_id, position);

ALTER TABLE briefing_quick_cuts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_briefing_quick_cuts" ON briefing_quick_cuts;
CREATE POLICY "public_read_briefing_quick_cuts" ON briefing_quick_cuts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_briefing_quick_cuts" ON briefing_quick_cuts;
CREATE POLICY "auth_insert_briefing_quick_cuts" ON briefing_quick_cuts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_briefing_quick_cuts" ON briefing_quick_cuts;
CREATE POLICY "auth_update_briefing_quick_cuts" ON briefing_quick_cuts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_briefing_quick_cuts" ON briefing_quick_cuts;
CREATE POLICY "auth_delete_briefing_quick_cuts" ON briefing_quick_cuts FOR DELETE
  TO authenticated USING (true);
