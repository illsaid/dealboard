/*
# Create buyers table

1. New Tables
  - `buyers`
    - `id` (text, primary key) — short slug identifier e.g. 'reelshort'
    - `name` (text, not null) — display name
    - `type` (text, not null) — buyer type enum value
    - `description` (text, not null) — editorial description
    - `primary_formats` (text[], not null) — array of format values
    - `territory` (text, not null) — territory enum value
    - `current_mandate` (text, not null) — current buying mandate
    - `mandate_confidence` (text, not null) — confidence level
    - `mandate_evidence` (text[], not null) — array of evidence strings
    - `recent_activity` (text, not null) — summary of recent activity
    - `activity_timeline` (jsonb, not null) — array of {date, event} objects
    - `contact_route` (text) — nullable submission/contact info
    - `open_questions` (text[], not null default '{}')
    - `last_verified` (date, not null)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

2. Security
  - Enable RLS on `buyers`.
  - Public read access (anon + authenticated SELECT).
  - Authenticated-only write access for the publishing pipeline.
*/

CREATE TABLE IF NOT EXISTS buyers (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  primary_formats text[] NOT NULL DEFAULT '{}',
  territory text NOT NULL,
  current_mandate text NOT NULL,
  mandate_confidence text NOT NULL,
  mandate_evidence text[] NOT NULL DEFAULT '{}',
  recent_activity text NOT NULL DEFAULT '',
  activity_timeline jsonb NOT NULL DEFAULT '[]',
  contact_route text,
  open_questions text[] NOT NULL DEFAULT '{}',
  last_verified date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_buyers" ON buyers;
CREATE POLICY "public_read_buyers" ON buyers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_buyers" ON buyers;
CREATE POLICY "auth_insert_buyers" ON buyers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_buyers" ON buyers;
CREATE POLICY "auth_update_buyers" ON buyers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_buyers" ON buyers;
CREATE POLICY "auth_delete_buyers" ON buyers FOR DELETE
  TO authenticated USING (true);
