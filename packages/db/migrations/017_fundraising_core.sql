-- CD2_OPS — Migration 017: Fundraising core tables
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- Extensions (safe)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- lanes: strategic fundraising buckets
CREATE TABLE IF NOT EXISTS cd2.fundraising_lanes (
  lane_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lane_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  owner_role text NOT NULL DEFAULT 'finance',
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- donors: canonical identity
CREATE TABLE IF NOT EXISTS cd2.donors (
  donor_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_type text NOT NULL DEFAULT 'person' CHECK (donor_type IN ('person','org')),
  first_name text,
  last_name text,
  org_name text,
  email text,
  phone text,
  address1 text,
  address2 text,
  city text,
  state text,
  zip text,
  employer text,
  occupation text,
  fec_employer text,
  fec_occupation text,
  notes text,
  tags text[] DEFAULT '{}'::text[],
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_donors_email ON cd2.donors (email);
CREATE INDEX IF NOT EXISTS idx_donors_phone ON cd2.donors (phone);

-- prospects: donor-in-context
CREATE TABLE IF NOT EXISTS cd2.fundraising_prospects (
  prospect_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id uuid NOT NULL REFERENCES cd2.donors(donor_id),
  lane_id uuid REFERENCES cd2.fundraising_lanes(lane_id),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','research','queued','active','paused','closed')),
  capacity_estimate numeric(12,2),
  ask_amount_suggested numeric(12,2),
  relationship_owner_user_id uuid REFERENCES cd2.users(user_id),
  source text,
  last_contact_at timestamptz,
  next_action_at timestamptz,
  next_action_note text,
  deleted_at timestamptz,
  deleted_by_user_id uuid REFERENCES cd2.users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(donor_id)
);

CREATE INDEX IF NOT EXISTS idx_prospects_lane ON cd2.fundraising_prospects (lane_id);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON cd2.fundraising_prospects (status);
CREATE INDEX IF NOT EXISTS idx_prospects_next_action ON cd2.fundraising_prospects (next_action_at);

-- call sessions: candidate call time blocks
CREATE TABLE IF NOT EXISTS cd2.call_sessions (
  session_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_type text NOT NULL DEFAULT 'candidate_call_time' CHECK (session_type IN ('candidate_call_time','finance_call_time','event_call_time')),
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  actual_start timestamptz,
  actual_end timestamptz,
  owner_user_id uuid REFERENCES cd2.users(user_id),
  notes text,
  source text NOT NULL DEFAULT 'web',
  deleted_at timestamptz,
  deleted_by_user_id uuid REFERENCES cd2.users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_sessions_owner ON cd2.call_sessions (owner_user_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_scheduled ON cd2.call_sessions (scheduled_start);

-- call attempts: each dial/outcome
CREATE TABLE IF NOT EXISTS cd2.call_attempts (
  attempt_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES cd2.call_sessions(session_id),
  prospect_id uuid NOT NULL REFERENCES cd2.fundraising_prospects(prospect_id),
  attempted_at timestamptz NOT NULL DEFAULT now(),
  outcome text NOT NULL CHECK (outcome IN ('no_answer','left_vm','talked','wrong_number','bad_number','scheduled_callback','refused')),
  duration_seconds int,
  notes text,
  actor_user_id uuid REFERENCES cd2.users(user_id),
  source text NOT NULL DEFAULT 'web',
  deleted_at timestamptz,
  deleted_by_user_id uuid REFERENCES cd2.users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_attempts_session ON cd2.call_attempts (session_id);
CREATE INDEX IF NOT EXISTS idx_call_attempts_prospect ON cd2.call_attempts (prospect_id);
CREATE INDEX IF NOT EXISTS idx_call_attempts_attempted ON cd2.call_attempts (attempted_at);

-- pledges: committed amounts
CREATE TABLE IF NOT EXISTS cd2.pledges (
  pledge_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id uuid NOT NULL REFERENCES cd2.fundraising_prospects(prospect_id),
  pledged_amount numeric(12,2) NOT NULL,
  pledged_at timestamptz NOT NULL DEFAULT now(),
  due_by date,
  status text NOT NULL DEFAULT 'pledged' CHECK (status IN ('pledged','partial','paid','written_off')),
  amount_received numeric(12,2) NOT NULL DEFAULT 0,
  method_expected text,
  notes text,
  actor_user_id uuid REFERENCES cd2.users(user_id),
  deleted_at timestamptz,
  deleted_by_user_id uuid REFERENCES cd2.users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pledges_status ON cd2.pledges (status);
CREATE INDEX IF NOT EXISTS idx_pledges_pledged_at ON cd2.pledges (pledged_at);

-- followups: task rigor
CREATE TABLE IF NOT EXISTS cd2.followups (
  followup_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id uuid NOT NULL REFERENCES cd2.fundraising_prospects(prospect_id),
  related_attempt_id uuid REFERENCES cd2.call_attempts(attempt_id),
  related_pledge_id uuid REFERENCES cd2.pledges(pledge_id),
  followup_type text NOT NULL DEFAULT 'send_link' CHECK (followup_type IN ('send_link','send_check_instructions','schedule_meeting','thank_you','reminder','research','other')),
  title text NOT NULL,
  details text,
  assigned_to_user_id uuid REFERENCES cd2.users(user_id),
  due_at timestamptz,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','done','canceled')),
  completed_at timestamptz,
  completed_by_user_id uuid REFERENCES cd2.users(user_id),
  source text NOT NULL DEFAULT 'web',
  deleted_at timestamptz,
  deleted_by_user_id uuid REFERENCES cd2.users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_followups_assigned ON cd2.followups (assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_followups_due ON cd2.followups (due_at);
CREATE INDEX IF NOT EXISTS idx_followups_status ON cd2.followups (status);

-- fundraising events
CREATE TABLE IF NOT EXISTS cd2.fundraising_events (
  event_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  event_type text NOT NULL DEFAULT 'reception' CHECK (event_type IN ('reception','house_party','call_time_event','major_donor_meeting','other')),
  location text,
  start_at timestamptz,
  end_at timestamptz,
  host_names text,
  suggested_ask numeric(12,2),
  goal_amount numeric(12,2),
  notes text,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','active','completed','canceled')),
  deleted_at timestamptz,
  deleted_by_user_id uuid REFERENCES cd2.users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fundraising_events_start ON cd2.fundraising_events (start_at);

-- event invites
CREATE TABLE IF NOT EXISTS cd2.event_invites (
  invite_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL REFERENCES cd2.fundraising_events(event_id),
  prospect_id uuid REFERENCES cd2.fundraising_prospects(prospect_id),
  donor_id uuid REFERENCES cd2.donors(donor_id),
  invite_status text NOT NULL DEFAULT 'invited' CHECK (invite_status IN ('invited','confirmed','declined','attended','no_show')),
  amount_asked numeric(12,2),
  amount_pledged numeric(12,2),
  amount_received numeric(12,2),
  notes text,
  deleted_at timestamptz,
  deleted_by_user_id uuid REFERENCES cd2.users(user_id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_invites_event ON cd2.event_invites (event_id);

COMMIT;
