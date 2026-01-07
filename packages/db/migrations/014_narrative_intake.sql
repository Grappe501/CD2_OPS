-- CD2_OPS — Migration 014: Narrative intake tables
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

DO $$ BEGIN
  CREATE TYPE confusion_level AS ENUM ('none','some','widespread');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Voter questions intake (from canvass/calls/events/discord)
CREATE TABLE IF NOT EXISTS narrative_questions (
  question_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  tag text,
  county text,
  source text, -- call|door|event|discord|sms|other
  observed_at timestamptz NOT NULL DEFAULT now(),
  submitted_by_user_id uuid REFERENCES users(user_id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS narrative_questions_week_idx ON narrative_questions(observed_at);
CREATE INDEX IF NOT EXISTS narrative_questions_tag_idx ON narrative_questions(tag);
CREATE INDEX IF NOT EXISTS narrative_questions_county_idx ON narrative_questions(county);

-- Confusion signals (weekly rollups can be computed)
CREATE TABLE IF NOT EXISTS narrative_confusion_signals (
  signal_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  county text,
  level confusion_level NOT NULL,
  theme text,
  notes text,
  observed_at timestamptz NOT NULL DEFAULT now(),
  submitted_by_user_id uuid REFERENCES users(user_id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS narrative_confusion_week_idx ON narrative_confusion_signals(observed_at);
CREATE INDEX IF NOT EXISTS narrative_confusion_level_idx ON narrative_confusion_signals(level);

-- Message discipline updates (comms lead / CM)
CREATE TABLE IF NOT EXISTS message_discipline_updates (
  update_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL, -- holding|slipping|broken (keep text for flexibility)
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by_user_id uuid REFERENCES users(user_id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS message_discipline_updated_idx ON message_discipline_updates(updated_at);

COMMIT;
