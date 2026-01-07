-- CD2_OPS — Stop Doing placeholder view (Module 15)
-- Back with a stop_doing table in a future module.

BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;

CREATE OR REPLACE VIEW cd2.v_stop_doing_active AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::uuid AS item_id,
  NULL::text AS title,
  NULL::text AS reason,
  NULL::timestamptz AS created_at
WHERE false;

COMMIT;
