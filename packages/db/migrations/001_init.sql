-- CD2_OPS — Module 1
-- Migration 001: Core schema (tables/enums) for operating system
-- Safe to re-run? NOT fully. Use DB reset in dev if needed.

BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- ---------- ENUMS ----------
DO $$ BEGIN
  CREATE TYPE role_key AS ENUM ('cm','candidate','finance','field','comms','data','admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE record_status AS ENUM ('active','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE risk_status AS ENUM ('stable','heating','triggered','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE decision_status AS ENUM ('open','blocked','decided','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE cadence_status AS ENUM ('on_track','at_risk','missed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ai_suggestion_status AS ENUM ('pending','accepted','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- CORE REFERENCE ----------
CREATE TABLE IF NOT EXISTS users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  email text UNIQUE,
  role role_key NOT NULL DEFAULT 'data',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  audit_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(user_id),
  action text NOT NULL,
  entity_type text,
  entity_id text,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- DECISIONS ----------
CREATE TABLE IF NOT EXISTS decisions (
  decision_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  owner_role role_key NOT NULL DEFAULT 'cm',
  owner_user_id uuid REFERENCES users(user_id),
  status decision_status NOT NULL DEFAULT 'open',
  priority int NOT NULL DEFAULT 3, -- 1 high, 5 low
  due_at timestamptz,
  requested_at timestamptz NOT NULL DEFAULT now(),
  first_reviewed_at timestamptz,
  decided_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- RISKS ----------
CREATE TABLE IF NOT EXISTS risks (
  risk_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  owner_role role_key NOT NULL DEFAULT 'cm',
  owner_user_id uuid REFERENCES users(user_id),
  status risk_status NOT NULL DEFAULT 'stable',
  severity int NOT NULL DEFAULT 3, -- 1 high, 5 low
  trigger_definition text,
  mitigation_plan text,
  last_signal_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);

-- ---------- CADENCE ----------
CREATE TABLE IF NOT EXISTS cadence_commitments (
  cadence_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_role role_key NOT NULL DEFAULT 'cm',
  owner_user_id uuid REFERENCES users(user_id),
  frequency text NOT NULL DEFAULT 'weekly', -- weekly/daily/etc
  status cadence_status NOT NULL DEFAULT 'on_track',
  last_completed_at timestamptz,
  miss_streak int NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- FINANCE (minimal skeleton) ----------
CREATE TABLE IF NOT EXISTS finance_daily_snapshot (
  snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT current_date,
  cash_on_hand numeric(14,2) NOT NULL DEFAULT 0,
  accounts_payable numeric(14,2) NOT NULL DEFAULT 0,
  projected_runway_days int NOT NULL DEFAULT 0,
  weekly_floor numeric(14,2) NOT NULL DEFAULT 0,
  raised_week numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS call_time_logs (
  call_log_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_date date NOT NULL DEFAULT current_date,
  lane text NOT NULL DEFAULT 'general',
  calls_made int NOT NULL DEFAULT 0,
  connects int NOT NULL DEFAULT 0,
  dollars_raised numeric(14,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- FIELD (minimal skeleton) ----------
CREATE TABLE IF NOT EXISTS field_coverage_snapshot (
  snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL DEFAULT current_date,
  county text NOT NULL DEFAULT 'all',
  precinct text NOT NULL DEFAULT 'all',
  precinct_lead_coverage_pct numeric(5,2) NOT NULL DEFAULT 0,
  county_pace_pct numeric(5,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- NARRATIVE (minimal skeleton) ----------
CREATE TABLE IF NOT EXISTS askhumans_responses (
  response_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_date date NOT NULL DEFAULT current_date,
  county text,
  question text,
  response text NOT NULL,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- AI LOGGING (per AI_CHARTER) ----------
CREATE TABLE IF NOT EXISTS ai_runs (
  run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(user_id),
  prompt_version text NOT NULL,
  model text NOT NULL,
  input_hash text,
  output_hash text,
  status text NOT NULL DEFAULT 'ok',
  latency_ms int,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_suggestions (
  suggestion_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES ai_runs(run_id),
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  proposed_changes_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidence numeric(4,3),
  status ai_suggestion_status NOT NULL DEFAULT 'pending',
  reviewer_user_id uuid REFERENCES users(user_id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------- INTEGRATION HEALTH ----------
CREATE TABLE IF NOT EXISTS integration_status (
  integration_key text PRIMARY KEY, -- openai/census/bls/discord/gcal/db
  is_enabled boolean NOT NULL DEFAULT false,
  last_ok_at timestamptz,
  last_error_at timestamptz,
  last_error text,
  metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMIT;
