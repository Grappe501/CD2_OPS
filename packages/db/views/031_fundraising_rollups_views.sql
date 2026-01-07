-- CD2_OPS — Views 031: Fundraising rollups to power dashboards (Module 28)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- Helper: prospect display name
CREATE OR REPLACE VIEW cd2.vw_fr_prospect_display AS
SELECT
  p.prospect_id,
  d.donor_id,
  COALESCE(d.org_name, trim(COALESCE(d.first_name,'') || ' ' || COALESCE(d.last_name,''))) AS display_name,
  d.phone,
  d.email,
  l.lane_key,
  l.name AS lane_name,
  p.status,
  p.capacity_estimate,
  p.ask_amount_suggested,
  p.last_contact_at,
  p.next_action_at,
  p.next_action_note
FROM cd2.fundraising_prospects p
JOIN cd2.donors d ON d.donor_id = p.donor_id
LEFT JOIN cd2.fundraising_lanes l ON l.lane_id = p.lane_id
WHERE p.deleted_at IS NULL AND d.is_active = true;

-- Candidate/Owner 7-day summary
CREATE OR REPLACE VIEW cd2.vw_fr_owner_summary_7d AS
SELECT
  s.owner_user_id,
  date_trunc('day', now()) AS as_of_day,
  coalesce(sum(EXTRACT(EPOCH FROM (coalesce(s.actual_end, s.scheduled_end) - coalesce(s.actual_start, s.scheduled_start))) / 3600.0),0) AS hours,
  count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL) AS dials,
  count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL AND a.outcome='talked') AS connects,
  count(pl.pledge_id) FILTER (WHERE pl.deleted_at IS NULL) AS pledges_count,
  coalesce(sum(pl.pledged_amount) FILTER (WHERE pl.deleted_at IS NULL),0) AS pledges_total
FROM cd2.call_sessions s
LEFT JOIN cd2.call_attempts a ON a.session_id = s.session_id AND a.deleted_at IS NULL
LEFT JOIN cd2.pledges pl ON pl.prospect_id = a.prospect_id AND pl.deleted_at IS NULL
WHERE s.deleted_at IS NULL
  AND coalesce(s.actual_start, s.scheduled_start, s.created_at) >= now() - interval '7 days'
GROUP BY 1;

-- Today summary (owner)
CREATE OR REPLACE VIEW cd2.vw_fr_owner_summary_today AS
SELECT
  s.owner_user_id,
  date_trunc('day', now()) AS day,
  coalesce(sum(EXTRACT(EPOCH FROM (coalesce(s.actual_end, s.scheduled_end) - coalesce(s.actual_start, s.scheduled_start))) / 3600.0),0) AS hours,
  count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL) AS dials,
  count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL AND a.outcome='talked') AS connects,
  count(pl.pledge_id) FILTER (WHERE pl.deleted_at IS NULL) AS pledges_count,
  coalesce(sum(pl.pledged_amount) FILTER (WHERE pl.deleted_at IS NULL),0) AS pledges_total
FROM cd2.call_sessions s
LEFT JOIN cd2.call_attempts a ON a.session_id = s.session_id AND a.deleted_at IS NULL
LEFT JOIN cd2.pledges pl ON pl.prospect_id = a.prospect_id AND pl.deleted_at IS NULL
WHERE s.deleted_at IS NULL
  AND date_trunc('day', coalesce(s.actual_start, s.scheduled_start, s.created_at)) = date_trunc('day', now())
GROUP BY 1,2;

-- Follow-ups overdue list
CREATE OR REPLACE VIEW cd2.vw_fr_followups_overdue AS
SELECT
  f.followup_id,
  f.title,
  f.followup_type,
  f.status,
  f.due_at,
  f.assigned_to_user_id,
  pd.display_name,
  pd.phone,
  pd.email,
  pd.lane_key,
  pd.lane_name,
  pd.prospect_id
FROM cd2.followups f
JOIN cd2.vw_fr_prospect_display pd ON pd.prospect_id = f.prospect_id
WHERE f.deleted_at IS NULL
  AND f.status IN ('open','in_progress')
  AND f.due_at IS NOT NULL
  AND f.due_at < now()
ORDER BY f.due_at ASC;

-- Open follow-ups list (for board/table)
CREATE OR REPLACE VIEW cd2.vw_fr_followups_open AS
SELECT
  f.followup_id,
  f.title,
  f.followup_type,
  f.status,
  f.due_at,
  f.assigned_to_user_id,
  pd.display_name,
  pd.lane_key,
  pd.lane_name,
  pd.prospect_id
FROM cd2.followups f
JOIN cd2.vw_fr_prospect_display pd ON pd.prospect_id = f.prospect_id
WHERE f.deleted_at IS NULL
  AND f.status IN ('open','in_progress')
ORDER BY (f.due_at IS NULL) ASC, f.due_at ASC NULLS LAST;

-- Recent pledges (last 14d)
CREATE OR REPLACE VIEW cd2.vw_fr_recent_pledges AS
SELECT
  pl.pledge_id,
  pl.pledged_at,
  pl.pledged_amount,
  pl.amount_received,
  (pl.pledged_amount - pl.amount_received) AS outstanding_amount,
  pl.status,
  pd.display_name,
  pd.lane_key,
  pd.lane_name,
  pd.prospect_id
FROM cd2.pledges pl
JOIN cd2.vw_fr_prospect_display pd ON pd.prospect_id = pl.prospect_id
WHERE pl.deleted_at IS NULL
  AND pl.pledged_at >= now() - interval '14 days'
ORDER BY pl.pledged_at DESC;

-- Prospect pipeline counts (status x lane)
CREATE OR REPLACE VIEW cd2.vw_fr_pipeline_status_lane AS
SELECT
  coalesce(l.lane_key,'UNASSIGNED') AS lane_key,
  coalesce(l.name,'Unassigned') AS lane_name,
  p.status,
  count(*) AS prospects
FROM cd2.fundraising_prospects p
LEFT JOIN cd2.fundraising_lanes l ON l.lane_id = p.lane_id
WHERE p.deleted_at IS NULL
GROUP BY 1,2,3
ORDER BY 1,3;

COMMIT;
