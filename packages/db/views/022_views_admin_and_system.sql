-- CD2_OPS — Admin/System views (Module 15)
-- Version: v1.6.0
-- Schema: cd2

BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;

CREATE OR REPLACE VIEW cd2.v_admin_users_summary AS
SELECT
  cd2.as_of_now() AS as_of,
  COUNT(*)::int AS users_total,
  SUM(CASE WHEN u.is_active THEN 1 ELSE 0 END)::int AS users_active
FROM cd2.users u;

CREATE OR REPLACE VIEW cd2.v_admin_permission_changes_7d AS
SELECT
  cd2.as_of_now() AS as_of,
  a.id AS audit_id,
  a.actor_user_id,
  a.entity_type,
  a.entity_id,
  a.action,
  a.created_at,
  a.metadata
FROM cd2.audit_log a
WHERE a.entity_type IN ('user_entitlement','user_role','user')
  AND a.created_at >= (cd2.as_of_now() - interval '7 days')
ORDER BY a.created_at DESC;

CREATE OR REPLACE VIEW cd2.v_admin_audit_volume AS
SELECT
  date_trunc('day', a.created_at)::date AS day,
  cd2.as_of_now() AS as_of,
  a.entity_type,
  COUNT(*)::int AS events
FROM cd2.audit_log a
GROUP BY 1,3
ORDER BY day DESC;

COMMIT;
