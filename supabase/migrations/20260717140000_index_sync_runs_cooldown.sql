/*
  Support the low-friction publication-sync cooldown check.

  The normal trigger is intentionally callable without the administrator
  secret, but it can run no more than once every five minutes. This index keeps
  that guard inexpensive as the sync audit log grows.
*/

CREATE INDEX IF NOT EXISTS idx_sync_runs_production_completed_at
  ON sync_runs (dry_run, completed_at DESC)
  WHERE completed_at IS NOT NULL;
