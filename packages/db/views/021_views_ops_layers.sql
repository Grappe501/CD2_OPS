-- CD2_OPS — Views for risks/decisions/cadence/narrative/field (Module 15)
-- Version: v1.6.0
-- Schema: cd2

BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;

-- =================
-- Decisions
-- =================
CREATE OR REPLACE VIEW cd2.v_decisions_queue AS
SELECT
  cd2.as_of_now() AS as_of,
  d.id AS decision_id,
  d.title,
  d.decision_class,
  d.status,
  d.owner_role,
  d.owner_user_id,
  d.created_at,
  d.updated_at,
  (EXTRACT(EPOCH FROM (cd2.as_of_now() - d.created_at))/86400.0)::numeric AS age_days
FROM cd2.decisions d
WHERE d.is_active = true;

CREATE OR REPLACE VIEW cd2.v_decisions_by_class AS
SELECT
  cd2.as_of_now() AS as_of,
  d.decision_class,
  COUNT(*)::int AS decisions_open_count,
  AVG((EXTRACT(EPOCH FROM (cd2.as_of_now() - d.created_at))/86400.0))::numeric AS avg_age_days
FROM cd2.decisions d
WHERE d.is_active = true
GROUP BY d.decision_class;

CREATE OR REPLACE VIEW cd2.v_decision_latency_sla AS
SELECT
  date_trunc('week', cd2.as_of_now())::date AS week_start,
  cd2.as_of_now() AS as_of,
  COUNT(*)::int AS decisions_touched,
  AVG((EXTRACT(EPOCH FROM (d.updated_at - d.created_at))/86400.0))::numeric AS avg_latency_days
FROM cd2.decisions d
WHERE d.is_active = true;

CREATE OR REPLACE VIEW cd2.v_decisions_queue_classed AS
SELECT *
FROM cd2.v_decisions_queue
ORDER BY
  CASE decision_class WHEN 'III' THEN 1 WHEN 'II' THEN 2 WHEN 'I' THEN 3 ELSE 9 END,
  created_at ASC;

-- =================
-- Risks
-- =================
CREATE OR REPLACE VIEW cd2.v_risk_register AS
SELECT
  cd2.as_of_now() AS as_of,
  r.id AS risk_id,
  r.title,
  r.category,
  r.status,
  r.heat,
  r.owner_role,
  r.owner_user_id,
  r.created_at,
  r.updated_at
FROM cd2.risks r
WHERE r.is_active = true;

CREATE OR REPLACE VIEW cd2.v_risks_heating_now AS
SELECT *
FROM cd2.v_risk_register
WHERE heat = 'heating'
ORDER BY updated_at DESC;

CREATE OR REPLACE VIEW cd2.v_risks_top3 AS
SELECT *
FROM cd2.v_risk_register
ORDER BY
  CASE heat WHEN 'heating' THEN 1 ELSE 2 END,
  updated_at DESC
LIMIT 3;

CREATE OR REPLACE VIEW cd2.v_risk_signals_recent AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::uuid AS signal_id,
  NULL::uuid AS risk_id,
  NULL::text AS category,
  NULL::text AS signal_text,
  NULL::timestamptz AS observed_at
WHERE false;

CREATE OR REPLACE VIEW cd2.v_risk_heatmap AS
SELECT
  cd2.as_of_now() AS as_of,
  r.category,
  COUNT(*)::int AS risks_open_count,
  SUM(CASE WHEN r.heat = 'heating' THEN 1 ELSE 0 END)::int AS risks_heating_count
FROM cd2.risks r
WHERE r.is_active = true
GROUP BY r.category;

-- =================
-- Cadence (placeholders)
-- =================
CREATE OR REPLACE VIEW cd2.v_cadence_commitments AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::text AS cadence_window,
  NULL::text AS owner_role,
  NULL::text AS commitment,
  NULL::text AS status,
  NULL::timestamptz AS due_at
WHERE false;

CREATE OR REPLACE VIEW cd2.v_cadence_miss_streaks AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::text AS owner_role,
  0::int AS cadence_miss_streak
WHERE false;

-- =================
-- Narrative & Trust (placeholders)
-- =================
CREATE OR REPLACE VIEW cd2.v_narrative_confusion AS
SELECT
  date_trunc('week', cd2.as_of_now())::date AS week_start,
  cd2.as_of_now() AS as_of,
  NULL::text AS county,
  NULL::text AS confusion_index,
  NULL::text AS top_confusion_theme;

CREATE OR REPLACE VIEW cd2.v_narrative_top_questions AS
SELECT
  date_trunc('week', cd2.as_of_now())::date AS week_start,
  cd2.as_of_now() AS as_of,
  NULL::text AS county,
  NULL::text AS tag,
  NULL::text AS question,
  0::int AS mentions
WHERE false;

CREATE OR REPLACE VIEW cd2.v_message_discipline_status AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::text AS message_discipline_status,
  NULL::text AS notes,
  NULL::timestamptz AS last_updated_at;

-- =================
-- Field (placeholders)
-- =================
CREATE OR REPLACE VIEW cd2.v_field_precinct_lead_coverage AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::text AS county,
  0::int AS precincts_total,
  0::int AS precincts_with_lead,
  0::numeric AS coverage_pct,
  NULL::text AS missing_precincts;

CREATE OR REPLACE VIEW cd2.v_field_county_pace AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::text AS county,
  NULL::int AS primary_turnout_total,
  NULL::int AS primary_votes_total,
  NULL::numeric AS pace_index;

CREATE OR REPLACE VIEW cd2.v_field_contact_to_ballot_funnel AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::text AS county,
  0::int AS contacts,
  0::int AS supporters_identified,
  0::int AS ballots_requested,
  0::int AS ballots_returned;

CREATE OR REPLACE VIEW cd2.v_field_events_activity AS
SELECT
  date_trunc('week', cd2.as_of_now())::date AS week_start,
  cd2.as_of_now() AS as_of,
  NULL::text AS county,
  0::int AS events_count,
  0::int AS shifts_count,
  0::int AS volunteers_active;

COMMIT;
