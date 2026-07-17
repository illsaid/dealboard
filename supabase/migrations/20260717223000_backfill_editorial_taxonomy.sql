/*
  Backfill the current public cohort from the Airtable editorial migration.
  Future writes are owned by sync-airtable-publication.
*/

UPDATE records
SET strategic_tags = CASE id
  WHEN 'samsung-tv-plus-dhar-mann-13-original-scripted-episodes' THEN ARRAY['legacy_crossover', 'creator_led', 'fast']::text[]
  WHEN 'reelshort-wwe-live-action-microdrama-partnership' THEN ARRAY['legacy_crossover', 'vertical']::text[]
  WHEN 'netflix-spotify-jay-shetty-on-purpose-video-partnership' THEN ARRAY['legacy_crossover', 'creator_led']::text[]
  WHEN 'golf-channel-big-break-good-good-august-rollout' THEN ARRAY['legacy_crossover', 'creator_led']::text[]
  WHEN 'trueid-dramabox-tatang-vertical-drama-thailand' THEN ARRAY['legacy_crossover', 'vertical']::text[]
  WHEN 'dhar-mann-holywater-fox-40-title-vertical-partnership' THEN ARRAY['legacy_crossover', 'vertical', 'creator_led']::text[]
  WHEN 'w-sport-samsung-tv-plus-nordics-helloyou-launch' THEN ARRAY['fast']::text[]
  WHEN 'casino-plus-bathala-vertical-drama-game-ip' THEN ARRAY['legacy_crossover', 'vertical', 'brand_funded']::text[]
  WHEN 'scrambled-up-season-2-samsung-tv-plus-window' THEN ARRAY['legacy_crossover', 'fast']::text[]
  WHEN 'tubi-exclusive-creator-partnership-launch-pipeline' THEN ARRAY['creator_led']::text[]
  WHEN 'mrbeast-100m-membership-ecosystem-platform-build' THEN ARRAY['creator_led']::text[]
  WHEN 'netflix-alans-universe-day-and-date-youtube' THEN ARRAY['legacy_crossover', 'creator_led']::text[]
  WHEN 'webtoon-espotlight-spanish-wattpad-first-look-pact' THEN ARRAY['legacy_crossover']::text[]
  WHEN 'roseberry-media-launches-epis-vertical-streamer' THEN ARRAY['vertical']::text[]
  WHEN 'fox-my-drama-farmer-wants-a-wife-vertical-adaptation' THEN ARRAY['legacy_crossover', 'vertical']::text[]
  ELSE strategic_tags
END
WHERE is_published = true;

UPDATE records
SET action = CASE
  WHEN id = 'roseberry-media-launches-epis-vertical-streamer' THEN
    jsonb_set(COALESCE(action, '{}'::jsonb), '{status}', '"verified"'::jsonb, true)
  ELSE
    jsonb_set(
      jsonb_set(
        jsonb_set(COALESCE(action, '{}'::jsonb), '{status}', '"not_researched"'::jsonb, true),
        '{label}',
        '"Route research not yet completed"'::jsonb,
        true
      ),
      '{evidence}',
      '"Dedicated route research has not yet been completed for this record."'::jsonb,
      true
    )
END
WHERE is_published = true;
