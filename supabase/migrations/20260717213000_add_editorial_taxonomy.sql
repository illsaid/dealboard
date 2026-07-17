/*
  Separate the editorial axes that were previously conflated in event_class.

  - record_class: confirmed deal, developing signal, or context
  - strategic_tags: orthogonal market tags; a record may carry several
  - event_class remains populated during the transition for older clients
*/

ALTER TABLE records
  ADD COLUMN IF NOT EXISTS record_class text,
  ADD COLUMN IF NOT EXISTS strategic_tags text[] NOT NULL DEFAULT '{}';

UPDATE records
SET record_class = CASE
  WHEN event_class = 'developing_signal' THEN 'developing_signal'
  WHEN event_class = 'confirmed_deal' THEN 'confirmed_deal'
  WHEN event_class = 'context' THEN 'context'
  ELSE 'confirmed_deal'
END
WHERE record_class IS NULL;

ALTER TABLE records
  ALTER COLUMN record_class SET DEFAULT 'context',
  ALTER COLUMN record_class SET NOT NULL;

ALTER TABLE records
  DROP CONSTRAINT IF EXISTS records_record_class_check;

ALTER TABLE records
  ADD CONSTRAINT records_record_class_check
  CHECK (record_class IN ('confirmed_deal', 'developing_signal', 'context'));

ALTER TABLE records
  DROP CONSTRAINT IF EXISTS records_strategic_tags_check;

ALTER TABLE records
  ADD CONSTRAINT records_strategic_tags_check
  CHECK (
    strategic_tags <@ ARRAY[
      'legacy_crossover',
      'vertical',
      'creator_led',
      'fast',
      'brand_funded'
    ]::text[]
  );

CREATE INDEX IF NOT EXISTS idx_records_record_class
  ON records(record_class);

CREATE INDEX IF NOT EXISTS idx_records_strategic_tags
  ON records USING gin(strategic_tags);
