-- CD2_OPS — Migration 013: Cadence commitments tracking
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

DO $$ BEGIN
  CREATE TYPE cadence_window AS ENUM ('day','week','two_week','six_week','ninety_day');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE commitment_status AS ENUM ('planned','in_progress','done','missed','canceled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS cadence_commitments (
  commitment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  window cadence_window NOT NULL,
  title text NOT NULL,
  description text,
  owner_role text NOT NULL,
  owner_user_id uuid REFERENCES users(user_id),
  due_at timestamptz NOT NULL,
  status commitment_status NOT NULL DEFAULT 'planned',
  completed_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_by_user_id uuid REFERENCES users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cadence_commitments_due_idx ON cadence_commitments(due_at);
CREATE INDEX IF NOT EXISTS cadence_commitments_owner_idx ON cadence_commitments(owner_user_id);
CREATE INDEX IF NOT EXISTS cadence_commitments_status_idx ON cadence_commitments(status);

COMMIT;
