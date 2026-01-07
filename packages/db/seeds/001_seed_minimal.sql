BEGIN;
CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- Minimal users
INSERT INTO users (display_name, email, role)
VALUES
  ('Steve Grappe','steve@local','cm'),
  ('Finance User','finance@local','finance'),
  ('Field User','field@local','field'),
  ('Comms User','comms@local','comms'),
  ('Admin User','admin@local','admin')
ON CONFLICT (email) DO NOTHING;

-- Minimal finance snapshot
INSERT INTO finance_daily_snapshot (snapshot_date, cash_on_hand, accounts_payable, projected_runway_days, weekly_floor, raised_week)
VALUES (current_date, 25000, 5000, 35, 15000, 8200);

-- Minimal call time log
INSERT INTO call_time_logs (call_date, lane, calls_made, connects, dollars_raised, notes)
VALUES (current_date, 'A', 60, 12, 1800, 'Seed call time log');

-- Minimal field snapshot
INSERT INTO field_coverage_snapshot (snapshot_date, county, precinct, precinct_lead_coverage_pct, county_pace_pct)
VALUES (current_date, 'Pulaski', 'P-01', 62.5, 84.0);

-- Minimal narrative response
INSERT INTO askhumans_responses (response_date, county, question, response, tags)
VALUES (current_date, 'Pulaski', 'What issue matters most?', 'Cost of living and healthcare.', '[]'::jsonb);

-- Minimal decision + risk + cadence
INSERT INTO decisions (title, description, owner_role, status, priority, due_at)
VALUES ('Lock weekly floor', 'Confirm weekly fundraising floor and lane pacing.', 'cm', 'open', 1, now() + interval '2 days');

INSERT INTO risks (title, description, owner_role, status, severity, trigger_definition, mitigation_plan, last_signal_at)
VALUES ('Runway slipping', 'Weekly floor miss risks runway.', 'cm', 'heating', 2, 'Raised < floor 2 weeks', 'Increase call time + add 1 event', now());

INSERT INTO cadence_commitments (name, owner_role, frequency, status, last_completed_at, miss_streak)
VALUES ('Monday AM scorecard publish', 'cm', 'weekly', 'on_track', now() - interval '3 days', 0);

COMMIT;
