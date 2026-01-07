-- CD2_OPS — Migration 016: soft delete columns for undo capability
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- narrative questions
ALTER TABLE IF EXISTS cd2.narrative_questions
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by_user_id uuid REFERENCES cd2.users(user_id);

-- confusion signals
ALTER TABLE IF EXISTS cd2.narrative_confusion_signals
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by_user_id uuid REFERENCES cd2.users(user_id);

-- stop doing items
ALTER TABLE IF EXISTS cd2.stop_doing_items
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by_user_id uuid REFERENCES cd2.users(user_id);

-- cadence commitments
ALTER TABLE IF EXISTS cd2.cadence_commitments
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_by_user_id uuid REFERENCES cd2.users(user_id);

COMMIT;
