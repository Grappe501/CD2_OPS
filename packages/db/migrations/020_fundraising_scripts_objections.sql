-- CD2_OPS — Migration 020: Fundraising scripts, objections, ask ladders (Module 31)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Script sets per lane
CREATE TABLE IF NOT EXISTS cd2.fundraising_script_sets (
  script_set_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lane_id uuid REFERENCES cd2.fundraising_lanes(lane_id),
  lane_key text,                         -- denormalized convenience (optional)
  title text NOT NULL,
  opening text NOT NULL,
  why_this_race text,
  credibility_bullets text,
  ask_line text NOT NULL,
  close_line text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- Ask ladder per lane
CREATE TABLE IF NOT EXISTS cd2.fundraising_ask_ladder (
  ask_ladder_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lane_id uuid REFERENCES cd2.fundraising_lanes(lane_id),
  lane_key text,
  amount numeric NOT NULL,
  label text, -- e.g., "Primary ask", "Downshift", "Stretch"
  sort_order int NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- Objection library (global or lane-specific)
CREATE TABLE IF NOT EXISTS cd2.fundraising_objections (
  objection_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lane_id uuid REFERENCES cd2.fundraising_lanes(lane_id),
  lane_key text,
  objection_key text NOT NULL,           -- e.g., "too_busy", "need_to_think"
  label text NOT NULL,                   -- shown on chip
  response_text text NOT NULL,           -- what we say
  note_insert text NOT NULL,             -- what we log (short)
  created_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

COMMIT;
