-- CD2_OPS — Narrative Intake Views (Module 17)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;

-- Confusion index rollup for narrative.confusion.index widget
CREATE OR REPLACE VIEW cd2.v_narrative_confusion AS
WITH wk AS (
  SELECT date_trunc('week', cd2.as_of_now())::date AS week_start
),
agg AS (
  SELECT
    date_trunc('week', n.observed_at)::date AS week_start,
    n.county,
    -- pick the highest severity level observed this week
    MAX(
      CASE n.level
        WHEN 'widespread' THEN 3
        WHEN 'some' THEN 2
        WHEN 'none' THEN 1
        ELSE 0
      END
    ) AS level_rank,
    -- top theme by count
    (SELECT theme
     FROM cd2.narrative_confusion_signals n2
     WHERE date_trunc('week', n2.observed_at)::date = date_trunc('week', cd2.as_of_now())::date
       AND (n2.county = n.county OR (n2.county IS NULL AND n.county IS NULL))
       AND n2.is_active = true
     GROUP BY theme
     ORDER BY COUNT(*) DESC NULLS LAST
     LIMIT 1) AS top_theme
  FROM cd2.narrative_confusion_signals n
  WHERE n.is_active = true
    AND date_trunc('week', n.observed_at)::date = (SELECT week_start FROM wk)
  GROUP BY 1,2
)
SELECT
  (SELECT week_start FROM wk) AS week_start,
  cd2.as_of_now() AS as_of,
  a.county,
  CASE a.level_rank
    WHEN 3 THEN 'widespread'
    WHEN 2 THEN 'some'
    WHEN 1 THEN 'none'
    ELSE NULL
  END::text AS confusion_index,
  a.top_theme AS top_confusion_theme
FROM agg a;

-- Top voter questions this week
CREATE OR REPLACE VIEW cd2.v_narrative_top_questions AS
WITH wk AS (
  SELECT date_trunc('week', cd2.as_of_now())::date AS week_start
)
SELECT
  (SELECT week_start FROM wk) AS week_start,
  cd2.as_of_now() AS as_of,
  q.county,
  q.tag,
  q.question,
  COUNT(*)::int AS mentions
FROM cd2.narrative_questions q
WHERE q.is_active = true
  AND date_trunc('week', q.observed_at)::date = (SELECT week_start FROM wk)
GROUP BY q.county, q.tag, q.question
ORDER BY mentions DESC
LIMIT 25;

-- Message discipline status (most recent update)
CREATE OR REPLACE VIEW cd2.v_message_discipline_status AS
SELECT
  cd2.as_of_now() AS as_of,
  m.status AS message_discipline_status,
  m.notes,
  m.updated_at AS last_updated_at
FROM cd2.message_discipline_updates m
WHERE m.is_active = true
ORDER BY m.updated_at DESC
LIMIT 1;

COMMIT;
