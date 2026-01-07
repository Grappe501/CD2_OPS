-- CD2_OPS — Audit actor display helper view (Module 23)
BEGIN;
CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- Provides a consistent projection for audit explorer widgets/APIs.
CREATE OR REPLACE VIEW cd2.vw_audit_with_actor AS
SELECT
  a.audit_id,
  a.occurred_at,
  a.actor_user_id,
  u.full_name AS actor_name,
  u.email AS actor_email,
  a.action,
  a.entity_type,
  a.entity_id,
  a.metadata
FROM cd2.audit_log a
LEFT JOIN cd2.users u ON u.user_id = a.actor_user_id
ORDER BY a.occurred_at DESC;

COMMIT;
