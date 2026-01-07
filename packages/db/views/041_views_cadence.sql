-- CD2_OPS — Cadence Views (Module 17)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;

-- Commitments list (for cadence.commitments widget)
CREATE OR REPLACE VIEW cd2.v_cadence_commitments AS
SELECT
  cd2.as_of_now() AS as_of,
  c.window::text AS cadence_window,
  c.owner_role,
  c.commitment_id,
  c.title AS commitment,
  c.status::text AS status,
  c.due_at,
  c.completed_at,
  (EXTRACT(EPOCH FROM (cd2.as_of_now() - c.due_at))/3600.0)::numeric AS hours_past_due
FROM cd2.cadence_commitments c
WHERE c.is_active = true
ORDER BY c.due_at ASC;

-- Miss streaks by owner_role (simple first-pass)
CREATE OR REPLACE VIEW cd2.v_cadence_miss_streaks AS
WITH recent AS (
  SELECT
    owner_role,
    status,
    due_at
  FROM cd2.cadence_commitments
  WHERE is_active = true
    AND due_at >= (cd2.as_of_now() - interval '60 days')
),
misses AS (
  SELECT
    owner_role,
    COUNT(*) FILTER (WHERE status = 'missed')::int AS missed_count
  FROM recent
  GROUP BY owner_role
)
SELECT
  cd2.as_of_now() AS as_of,
  m.owner_role,
  COALESCE(m.missed_count,0)::int AS cadence_miss_streak
FROM misses m
ORDER BY cadence_miss_streak DESC;

COMMIT;
