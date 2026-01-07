-- CD2_OPS — Migration 012: Stop-Doing commitments
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

DO $$ BEGIN
  CREATE TYPE stop_doing_status AS ENUM ('active','paused','retired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS stop_doing_items (
  item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  reason text,
  owner_role text NOT NULL DEFAULT 'cm',
  owner_user_id uuid REFERENCES users(user_id),
  status stop_doing_status NOT NULL DEFAULT 'active',
  effective_start date NOT NULL DEFAULT now()::date,
  effective_end date,
  is_active boolean NOT NULL DEFAULT true,
  created_by_user_id uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stop_doing_items_status_idx ON stop_doing_items(status);
CREATE INDEX IF NOT EXISTS stop_doing_items_active_idx ON stop_doing_items(is_active);

-- Exceptions: allow intentional, time-bounded breaks (and track them)
CREATE TABLE IF NOT EXISTS stop_doing_exceptions (
  exception_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES stop_doing_items(item_id) ON DELETE CASCADE,
  reason text NOT NULL,
  approved_by_user_id uuid REFERENCES users(user_id),
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  created_by_user_id uuid REFERENCES users(user_id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stop_doing_exceptions_item_idx ON stop_doing_exceptions(item_id);
CREATE INDEX IF NOT EXISTS stop_doing_exceptions_active_idx ON stop_doing_exceptions(is_active);

COMMIT;
