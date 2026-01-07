-- CD2_OPS — Migration 010: Fundraising pipeline + follow-ups
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- ---- ENUMS ----
DO $$ BEGIN
  CREATE TYPE donor_stage AS ENUM ('prospect','asked','soft_yes','pledged','closed','declined');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE followup_status AS ENUM ('open','completed','canceled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE contribution_method AS ENUM ('check','credit_card','actblue','wire','cash','in_kind','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---- DONORS ----
CREATE TABLE IF NOT EXISTS donors (
  donor_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  phone text,
  city text,
  state text,
  zip text,
  employer text,
  occupation text,
  stage donor_stage NOT NULL DEFAULT 'prospect',
  max_capacity numeric(14,2),
  notes text,
  created_by_user_id uuid REFERENCES users(user_id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS donors_stage_idx ON donors(stage);
CREATE INDEX IF NOT EXISTS donors_active_idx ON donors(is_active);

-- ---- PLEDGES ----
CREATE TABLE IF NOT EXISTS pledges (
  pledge_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES donors(donor_id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL,
  pledged_at timestamptz NOT NULL DEFAULT now(),
  expected_close_at timestamptz,
  status text NOT NULL DEFAULT 'open', -- open|closed|canceled (keep text for flexibility)
  notes text,
  created_by_user_id uuid REFERENCES users(user_id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pledges_donor_idx ON pledges(donor_id);
CREATE INDEX IF NOT EXISTS pledges_status_idx ON pledges(status);

-- ---- CONTRIBUTIONS ----
CREATE TABLE IF NOT EXISTS contributions (
  contribution_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES donors(donor_id) ON DELETE SET NULL,
  amount numeric(14,2) NOT NULL,
  contributed_at timestamptz NOT NULL DEFAULT now(),
  method contribution_method NOT NULL DEFAULT 'other',
  memo text,
  entered_by_user_id uuid REFERENCES users(user_id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contributions_donor_idx ON contributions(donor_id);
CREATE INDEX IF NOT EXISTS contributions_date_idx ON contributions(contributed_at);

-- ---- FOLLOW-UPS ----
CREATE TABLE IF NOT EXISTS followups (
  followup_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES donors(donor_id) ON DELETE SET NULL,
  contact_name text, -- if donor_id is null, still allow tracking
  lane text NOT NULL DEFAULT 'followups',
  due_at timestamptz NOT NULL,
  status followup_status NOT NULL DEFAULT 'open',
  completed_at timestamptz,
  owner_user_id uuid REFERENCES users(user_id),
  created_by_user_id uuid REFERENCES users(user_id),
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS followups_due_idx ON followups(due_at);
CREATE INDEX IF NOT EXISTS followups_status_idx ON followups(status);
CREATE INDEX IF NOT EXISTS followups_owner_idx ON followups(owner_user_id);

COMMIT;
