-- CD2_OPS — Stop-Doing Views (Module 17)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;

CREATE OR REPLACE VIEW cd2.v_stop_doing_active AS
SELECT
  cd2.as_of_now() AS as_of,
  s.item_id,
  s.title,
  s.reason,
  s.owner_role,
  s.owner_user_id::text AS owner_user_id,
  s.status::text AS status,
  s.effective_start,
  s.effective_end,
  s.created_at,
  s.updated_at,
  COALESCE((
    SELECT COUNT(*)
    FROM cd2.stop_doing_exceptions e
    WHERE e.item_id = s.item_id
      AND e.is_active = true
      AND (e.ends_at IS NULL OR e.ends_at >= cd2.as_of_now())
  ),0)::int AS active_exceptions
FROM cd2.stop_doing_items s
WHERE s.is_active = true
  AND s.status = 'active'
ORDER BY s.updated_at DESC;

COMMIT;
