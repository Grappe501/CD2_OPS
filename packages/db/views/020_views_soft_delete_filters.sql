-- CD2_OPS — Views patch for soft-delete behavior (Module 23)
-- Ensure widget-facing views exclude deleted rows.

BEGIN;
CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- Narrative: Top Questions
CREATE OR REPLACE VIEW cd2.vw_narrative_top_questions AS
SELECT
  date_trunc('day', q.observed_at) AS day,
  q.tag,
  q.county,
  q.source,
  count(*) AS question_count,
  max(q.observed_at) AS last_seen_at
FROM cd2.narrative_questions q
WHERE q.deleted_at IS NULL
GROUP BY 1,2,3,4;

-- Narrative: Confusion Index (simple)
CREATE OR REPLACE VIEW cd2.vw_narrative_confusion_index AS
SELECT
  date_trunc('day', s.observed_at) AS day,
  s.county,
  s.level,
  count(*) AS signal_count,
  max(s.observed_at) AS last_seen_at
FROM cd2.narrative_confusion_signals s
WHERE s.deleted_at IS NULL
GROUP BY 1,2,3;

-- CM board: Stop Doing active items
CREATE OR REPLACE VIEW cd2.vw_cm_stop_doing_active AS
SELECT
  i.item_id,
  i.title,
  i.reason,
  i.owner_role,
  i.status,
  i.created_at
FROM cd2.stop_doing_items i
WHERE i.deleted_at IS NULL
ORDER BY i.created_at DESC;

-- Cadence: commitments (non-deleted)
CREATE OR REPLACE VIEW cd2.vw_cadence_commitments_open AS
SELECT
  c.commitment_id,
  c.window,
  c.title,
  c.description,
  c.owner_role,
  c.status,
  c.due_at,
  c.created_at
FROM cd2.cadence_commitments c
WHERE c.deleted_at IS NULL AND c.status <> 'done'
ORDER BY c.due_at ASC;

COMMIT;
