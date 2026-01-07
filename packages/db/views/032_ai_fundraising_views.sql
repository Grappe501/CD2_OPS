-- CD2_OPS — Views 032: AI activity views (Module 29)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- AI usage rollup (last 14 days)
CREATE OR REPLACE VIEW cd2.vw_ai_usage_14d AS
SELECT
  date_trunc('day', created_at) AS day,
  prompt_key,
  count(*) AS suggestions,
  count(*) FILTER (WHERE status='approved') AS approved,
  count(*) FILTER (WHERE status='used') AS used
FROM cd2.ai_suggestions
WHERE created_at >= now() - interval '14 days'
GROUP BY 1,2
ORDER BY 1 DESC, 2;

-- Latest AI suggestions per prospect (for context)
CREATE OR REPLACE VIEW cd2.vw_fr_ai_latest_by_prospect AS
SELECT DISTINCT ON (linked_entity_id)
  suggestion_id,
  prompt_key,
  prompt_version,
  status,
  created_at,
  linked_entity_id AS prospect_id,
  left(output_text, 400) AS output_preview
FROM cd2.ai_suggestions
WHERE linked_entity_type='prospect'
ORDER BY linked_entity_id, created_at DESC;

COMMIT;
