-- CD2_OPS — Fundraising Pipeline + Follow-ups views (Module 16)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;

-- Pipeline stages used by finance.pipeline.stages widget
CREATE OR REPLACE VIEW cd2.v_donor_pipeline_stages AS
SELECT
  cd2.as_of_now() AS as_of,
  d.stage::text AS stage,
  COUNT(*)::int AS count_contacts,
  COALESCE(SUM(CASE WHEN d.stage IN ('pledged','soft_yes','asked') THEN d.max_capacity ELSE 0 END), 0)::numeric AS amount_expected
FROM cd2.donors d
WHERE d.is_active = true
GROUP BY d.stage
ORDER BY d.stage;

-- Follow-ups SLA queue used by finance.followups.sla_queue & calltime.queue.followups
CREATE OR REPLACE VIEW cd2.v_followups_sla_queue AS
SELECT
  cd2.as_of_now() AS as_of,
  f.followup_id,
  COALESCE(d.full_name, f.contact_name) AS contact_name,
  f.lane,
  f.due_at,
  CASE
    WHEN f.status <> 'open' THEN 0
    WHEN f.due_at < cd2.as_of_now() THEN (EXTRACT(EPOCH FROM (cd2.as_of_now() - f.due_at))/60)::int
    ELSE 0
  END AS minutes_overdue,
  f.owner_user_id::text AS owner_user_id
FROM cd2.followups f
LEFT JOIN cd2.donors d ON d.donor_id = f.donor_id
WHERE f.is_active = true
  AND f.status = 'open'
ORDER BY f.due_at ASC;

CREATE OR REPLACE VIEW cd2.v_followups_queue AS
SELECT * FROM cd2.v_followups_sla_queue;

COMMIT;
