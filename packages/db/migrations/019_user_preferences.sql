-- CD2_OPS — Migration 019: Per-user UI preferences (Module 30)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS cd2.user_preferences (
  preference_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES cd2.users(user_id),
  elder_mode boolean NOT NULL DEFAULT false,
  reduced_motion boolean NOT NULL DEFAULT false,
  default_call_outcome text, -- optional default
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

COMMIT;
