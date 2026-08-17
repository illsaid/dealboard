/*
# Add is_published flag to briefings table

1. Modified Tables
  - `briefings`
    - Added `is_published` (boolean, NOT NULL, DEFAULT false) — gates public
      visibility so draft briefings are invisible to anonymous visitors.

2. Security Changes
  - Replaced `public_read_briefings` RLS policy:
    - `anon` role can now SELECT only rows where `is_published = true`.
    - `authenticated` role can SELECT all rows (drafts included) so the admin
      UI can list and edit unpublished briefings.
  - `briefing_mandates` and `briefing_quick_cuts` policies are unchanged — they
    are only ever read joined to a briefing the caller can already see.
*/

-- Add the column idempotently
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'briefings' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE briefings ADD COLUMN is_published boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Replace the public read policy: anon sees only published, authenticated sees all
DROP POLICY IF EXISTS "public_read_briefings" ON briefings;
CREATE POLICY "anon_read_published_briefings" ON briefings FOR SELECT
  TO anon USING (is_published = true);

DROP POLICY IF EXISTS "anon_read_published_briefings_auth" ON briefings;
DROP POLICY IF EXISTS "auth_read_all_briefings" ON briefings;
CREATE POLICY "auth_read_all_briefings" ON briefings FOR SELECT
  TO authenticated USING (true);
