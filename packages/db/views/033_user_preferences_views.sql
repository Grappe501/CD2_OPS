-- CD2_OPS — Views 033: User preference views (Module 30)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

CREATE OR REPLACE VIEW cd2.vw_user_preferences AS
SELECT
  u.user_id,
  coalesce(p.elder_mode,false) AS elder_mode,
  coalesce(p.reduced_motion,false) AS reduced_motion,
  p.default_call_outcome,
  coalesce(p.updated_at, u.updated_at) AS updated_at
FROM cd2.users u
LEFT JOIN cd2.user_preferences p ON p.user_id = u.user_id
WHERE u.deleted_at IS NULL;

COMMIT;
