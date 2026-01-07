-- CD2_OPS — Compatibility views (Module 16)
-- Aligns Module 14 widget expectations with Module 1 table schemas.

BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;

-- Decisions queue with computed decision_class (I/II/III) from priority
-- mapping:
--   priority 1 -> III (highest urgency)
--   priority 2 -> II
--   priority 3+ -> I
CREATE OR REPLACE VIEW cd2.v_decisions_queue AS
SELECT
  cd2.as_of_now() AS as_of,
  d.decision_id AS decision_id,
  d.title,
  d.description,
  d.owner_role::text AS owner_role,
  d.owner_user_id::text AS owner_user_id,
  d.status::text AS status,
  d.priority,
  CASE
    WHEN d.priority = 1 THEN 'III'
    WHEN d.priority = 2 THEN 'II'
    ELSE 'I'
  END AS decision_class,
  d.created_at,
  d.updated_at,
  (EXTRACT(EPOCH FROM (cd2.as_of_now() - d.created_at))/86400.0)::numeric AS age_days
FROM cd2.decisions d
WHERE d.created_at IS NOT NULL;

CREATE OR REPLACE VIEW cd2.v_decisions_queue_classed AS
SELECT *
FROM cd2.v_decisions_queue
ORDER BY
  CASE decision_class WHEN 'III' THEN 1 WHEN 'II' THEN 2 WHEN 'I' THEN 3 ELSE 9 END,
  created_at ASC;

CREATE OR REPLACE VIEW cd2.v_decisions_by_class AS
SELECT
  cd2.as_of_now() AS as_of,
  decision_class,
  COUNT(*)::int AS decisions_open_count,
  AVG(age_days)::numeric AS avg_age_days
FROM cd2.v_decisions_queue
WHERE status IN ('open','blocked')
GROUP BY decision_class;

CREATE OR REPLACE VIEW cd2.v_decision_latency_sla AS
SELECT
  date_trunc('week', cd2.as_of_now())::date AS week_start,
  cd2.as_of_now() AS as_of,
  COUNT(*)::int AS decisions_touched,
  AVG((EXTRACT(EPOCH FROM (d.updated_at - d.created_at))/86400.0))::numeric AS avg_latency_days
FROM cd2.decisions d;

-- Risks: expose heat derived from status
CREATE OR REPLACE VIEW cd2.v_risk_register AS
SELECT
  cd2.as_of_now() AS as_of,
  r.risk_id AS risk_id,
  r.title,
  r.description,
  r.owner_role::text AS owner_role,
  r.owner_user_id::text AS owner_user_id,
  r.status::text AS status,
  CASE
    WHEN r.status IN ('heating','triggered') THEN 'heating'
    ELSE 'stable'
  END AS heat,
  r.severity,
  r.last_signal_at,
  r.created_at,
  r.updated_at,
  r.closed_at
FROM cd2.risks r;

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

CREATE OR REPLACE VIEW cd2.v_risk_heatmap AS
SELECT
  cd2.as_of_now() AS as_of,
  COALESCE(r.description,'general')::text AS category,
  COUNT(*)::int AS risks_open_count,
  SUM(CASE WHEN (CASE WHEN r.status IN ('heating','triggered') THEN 'heating' ELSE 'stable' END) = 'heating' THEN 1 ELSE 0 END)::int AS risks_heating_count
FROM cd2.risks r
WHERE r.closed_at IS NULL
GROUP BY 2;

COMMIT;
