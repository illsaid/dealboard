/*
# Create records table

1. New Tables
  - `records`
    - `id` (text, primary key) — record identifier e.g. 'rec-001'
    - `date` (date, not null) — official announcement date
    - `buyer` (text, not null) — buyer display name (denormalized for search)
    - `buyer_id` (text, not null, FK to buyers) — buyer reference
    - `headline` (text, not null)
    - `record_type` (text, not null) — acquisition, commission, fund_launch, etc.
    - `event_class` (text, not null) — confirmed_deal, developing_signal, legacy_crossover
    - `format` (text, not null) — microdrama, short_form, series, etc.
    - `territory` (text, not null)
    - `evidence_tier` (text, not null) — tier_1, tier_2, tier_3
    - `confidence` (text, not null) — high, medium, low
    - `summary` (text, not null)
    - `verified_facts` (text[], not null)
    - `interpretation` (text, not null)
    - `why_it_matters` (text, not null)
    - `action` (jsonb, not null) — ProfessionalAction object {status, label, description, url?, evidence?}
    - `sources` (jsonb, not null) — array of {name, url, readTime}
    - `related_record_ids` (text[], not null default '{}')
    - `first_captured` (date, not null)
    - `last_verified` (date, not null)
    - `locked` (boolean, not null default false) — subscriber-only flag
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

2. Indexes
  - On `buyer_id` for buyer lookups
  - On `event_class` for taxonomy filtering
  - On `date` for date range queries
  - On `record_type` for type filtering

3. Security
  - Enable RLS on `records`.
  - Public read access (anon + authenticated SELECT).
  - Authenticated-only write access for the publishing pipeline.
*/

CREATE TABLE IF NOT EXISTS records (
  id text PRIMARY KEY,
  date date NOT NULL,
  buyer text NOT NULL,
  buyer_id text NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  headline text NOT NULL,
  record_type text NOT NULL,
  event_class text NOT NULL,
  format text NOT NULL,
  territory text NOT NULL,
  evidence_tier text NOT NULL,
  confidence text NOT NULL,
  summary text NOT NULL,
  verified_facts text[] NOT NULL DEFAULT '{}',
  interpretation text NOT NULL DEFAULT '',
  why_it_matters text NOT NULL DEFAULT '',
  action jsonb NOT NULL DEFAULT '{}',
  sources jsonb NOT NULL DEFAULT '[]',
  related_record_ids text[] NOT NULL DEFAULT '{}',
  first_captured date NOT NULL DEFAULT CURRENT_DATE,
  last_verified date NOT NULL DEFAULT CURRENT_DATE,
  locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_records_buyer_id ON records(buyer_id);
CREATE INDEX IF NOT EXISTS idx_records_event_class ON records(event_class);
CREATE INDEX IF NOT EXISTS idx_records_date ON records(date DESC);
CREATE INDEX IF NOT EXISTS idx_records_record_type ON records(record_type);

ALTER TABLE records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_records" ON records;
CREATE POLICY "public_read_records" ON records FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_records" ON records;
CREATE POLICY "auth_insert_records" ON records FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_records" ON records;
CREATE POLICY "auth_update_records" ON records FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_records" ON records;
CREATE POLICY "auth_delete_records" ON records FOR DELETE
  TO authenticated USING (true);
