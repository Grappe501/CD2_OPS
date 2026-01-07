-- CD2_OPS — Views 034: Fundraising scripts / objections / ladder (Module 31)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- Active script set by lane (one row per lane, pick most recent non-deleted)
CREATE OR REPLACE VIEW cd2.vw_fr_script_set_active AS
SELECT DISTINCT ON (coalesce(l.lane_key, s.lane_key, 'UNASSIGNED'))
  coalesce(l.lane_key, s.lane_key, 'UNASSIGNED') AS lane_key,
  coalesce(l.name, 'Unassigned') AS lane_name,
  s.script_set_id,
  s.title,
  s.opening,
  s.why_this_race,
  s.credibility_bullets,
  s.ask_line,
  s.close_line,
  s.updated_at
FROM cd2.fundraising_script_sets s
LEFT JOIN cd2.fundraising_lanes l ON l.lane_id = s.lane_id
WHERE s.deleted_at IS NULL
ORDER BY coalesce(l.lane_key, s.lane_key, 'UNASSIGNED'), s.updated_at DESC;

-- Ask ladder per lane
CREATE OR REPLACE VIEW cd2.vw_fr_ask_ladder AS
SELECT
  coalesce(l.lane_key, a.lane_key, 'UNASSIGNED') AS lane_key,
  coalesce(l.name, 'Unassigned') AS lane_name,
  a.ask_ladder_id,
  a.amount,
  a.label,
  a.sort_order
FROM cd2.fundraising_ask_ladder a
LEFT JOIN cd2.fundraising_lanes l ON l.lane_id = a.lane_id
WHERE a.deleted_at IS NULL
ORDER BY 1, a.sort_order ASC, a.amount DESC;

-- Objection library
CREATE OR REPLACE VIEW cd2.vw_fr_objections AS
SELECT
  coalesce(l.lane_key, o.lane_key, 'GLOBAL') AS lane_key,
  coalesce(l.name, 'Global') AS lane_name,
  o.objection_id,
  o.objection_key,
  o.label,
  o.response_text,
  o.note_insert
FROM cd2.fundraising_objections o
LEFT JOIN cd2.fundraising_lanes l ON l.lane_id = o.lane_id
WHERE o.deleted_at IS NULL
ORDER BY 1, o.label;

COMMIT;
