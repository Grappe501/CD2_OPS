-- CD2_OPS — Module 1
-- Views 001: Dashboard skeleton views (placeholder outputs)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- Candidate Cockpit
CREATE OR REPLACE VIEW v_candidate_outcome_tiles AS
SELECT
  now() AS as_of,
  (SELECT COALESCE(projected_runway_days,0) FROM finance_daily_snapshot ORDER BY snapshot_date DESC, created_at DESC LIMIT 1) AS runway_days,
  (SELECT COUNT(*) FROM risks WHERE status='triggered') AS risks_triggered,
  (SELECT COUNT(*) FROM decisions WHERE status IN ('open','blocked')) AS decisions_open;

CREATE OR REPLACE VIEW v_next_actions_queue AS
SELECT
  now() AS as_of,
  'decision'::text AS action_type,
  d.decision_id::text AS action_id,
  d.title AS action_title,
  d.status::text AS status,
  d.owner_role::text AS owner_role,
  d.due_at
FROM decisions d
WHERE d.status IN ('open','blocked')
ORDER BY d.priority ASC, d.due_at NULLS LAST
LIMIT 25;

-- CM Operating Board
CREATE OR REPLACE VIEW v_weekly_scorecard AS
SELECT
  now() AS as_of,
  (SELECT COALESCE(raised_week,0) FROM finance_daily_snapshot ORDER BY snapshot_date DESC, created_at DESC LIMIT 1) AS raised_week,
  (SELECT COALESCE(weekly_floor,0) FROM finance_daily_snapshot ORDER BY snapshot_date DESC, created_at DESC LIMIT 1) AS weekly_floor,
  (SELECT COUNT(*) FROM risks WHERE status IN ('heating','triggered')) AS risks_open,
  (SELECT COUNT(*) FROM decisions WHERE status IN ('open','blocked')) AS decisions_open;

-- Finance Command
CREATE OR REPLACE VIEW v_finance_runway AS
SELECT
  now() AS as_of,
  s.cash_on_hand,
  s.accounts_payable,
  s.projected_runway_days AS runway_days,
  s.weekly_floor,
  s.raised_week,
  CASE
    WHEN s.weekly_floor = 0 THEN 'unknown'
    WHEN s.raised_week >= s.weekly_floor THEN 'on_track'
    ELSE 'behind'
  END AS pacing_status
FROM finance_daily_snapshot s
ORDER BY s.snapshot_date DESC, s.created_at DESC
LIMIT 1;

-- Field Command
CREATE OR REPLACE VIEW v_field_coverage_pace AS
SELECT
  now() AS as_of,
  COALESCE(f.county,'all') AS county,
  COALESCE(f.precinct,'all') AS precinct,
  f.precinct_lead_coverage_pct,
  f.county_pace_pct,
  CASE
    WHEN f.county_pace_pct >= 100 THEN 'on_track'
    WHEN f.county_pace_pct >= 85 THEN 'at_risk'
    ELSE 'behind'
  END AS pace_status
FROM field_coverage_snapshot f
ORDER BY f.snapshot_date DESC, f.created_at DESC
LIMIT 200;

-- Narrative
CREATE OR REPLACE VIEW v_narrative_confusion AS
SELECT
  now() AS as_of,
  COALESCE(county,'unknown') AS county,
  COUNT(*) AS responses_count,
  0.0::numeric AS confusion_index -- placeholder until tagging + scoring modules
FROM askhumans_responses
GROUP BY COALESCE(county,'unknown')
ORDER BY responses_count DESC;

-- Decisions
CREATE OR REPLACE VIEW v_decisions_queue AS
SELECT
  now() AS as_of,
  d.decision_id,
  d.title,
  d.status::text AS status,
  d.owner_role::text AS owner_role,
  d.due_at,
  d.requested_at,
  d.first_reviewed_at,
  d.decided_at,
  CASE
    WHEN d.decided_at IS NOT NULL THEN EXTRACT(EPOCH FROM (d.decided_at - d.requested_at))/86400.0
    ELSE EXTRACT(EPOCH FROM (now() - d.requested_at))/86400.0
  END AS latency_days
FROM decisions d
ORDER BY d.priority ASC, d.due_at NULLS LAST;

-- Risks
CREATE OR REPLACE VIEW v_risk_register AS
SELECT
  now() AS as_of,
  r.risk_id,
  r.title,
  r.status::text AS status,
  r.owner_role::text AS owner_role,
  r.severity,
  r.last_signal_at,
  r.trigger_definition,
  r.mitigation_plan
FROM risks r
WHERE r.status <> 'closed'
ORDER BY r.status DESC, r.severity ASC, COALESCE(r.last_signal_at, r.updated_at) DESC;

-- Cadence
CREATE OR REPLACE VIEW v_cadence_commitments AS
SELECT
  now() AS as_of,
  c.cadence_id,
  c.name,
  c.owner_role::text AS owner_role,
  c.status::text AS status,
  c.frequency,
  c.last_completed_at,
  c.miss_streak
FROM cadence_commitments c
ORDER BY c.miss_streak DESC, c.name ASC;

COMMIT;
