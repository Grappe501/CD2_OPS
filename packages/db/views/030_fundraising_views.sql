-- CD2_OPS — Views 030: Fundraising KPI views (Module 27)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;
SET search_path TO cd2, public;

-- Daily call time productivity
CREATE OR REPLACE VIEW cd2.vw_fr_call_time_daily AS
SELECT
  date_trunc('day', coalesce(s.actual_start, s.scheduled_start, s.created_at)) AS day,
  s.owner_user_id,
  count(DISTINCT s.session_id) AS sessions_count,
  sum(EXTRACT(EPOCH FROM (coalesce(s.actual_end, s.scheduled_end) - coalesce(s.actual_start, s.scheduled_start))) / 3600.0) AS hours_scheduled_or_actual,
  count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL) AS dials,
  count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL AND a.outcome IN ('talked')) AS connects,
  round(avg(a.duration_seconds) FILTER (WHERE a.deleted_at IS NULL AND a.duration_seconds IS NOT NULL))::int AS avg_talk_seconds
FROM cd2.call_sessions s
LEFT JOIN cd2.call_attempts a ON a.session_id = s.session_id
WHERE s.deleted_at IS NULL
GROUP BY 1,2;

-- Lane performance
CREATE OR REPLACE VIEW cd2.vw_fr_lane_performance AS
SELECT
  l.lane_id,
  l.lane_key,
  l.name AS lane_name,
  count(DISTINCT p.prospect_id) FILTER (WHERE p.deleted_at IS NULL) AS prospects,
  count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL) AS dials,
  count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL AND a.outcome='talked') AS connects,
  CASE WHEN count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL) = 0
    THEN 0
    ELSE round(
      (count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL AND a.outcome='talked')::numeric
      / count(a.attempt_id) FILTER (WHERE a.deleted_at IS NULL)::numeric) * 100, 1)
  END AS connect_rate_pct,
  count(pl.pledge_id) FILTER (WHERE pl.deleted_at IS NULL) AS pledges_count,
  coalesce(sum(pl.pledged_amount) FILTER (WHERE pl.deleted_at IS NULL),0) AS pledges_total,
  coalesce(sum(pl.amount_received) FILTER (WHERE pl.deleted_at IS NULL),0) AS received_total
FROM cd2.fundraising_lanes l
LEFT JOIN cd2.fundraising_prospects p ON p.lane_id = l.lane_id
LEFT JOIN cd2.call_attempts a ON a.prospect_id = p.prospect_id
LEFT JOIN cd2.pledges pl ON pl.prospect_id = p.prospect_id
WHERE l.is_active = true
GROUP BY 1,2,3;

-- Pledge aging
CREATE OR REPLACE VIEW cd2.vw_fr_pledge_aging AS
SELECT
  CASE
    WHEN now() - pl.pledged_at < interval '7 days' THEN '0-6d'
    WHEN now() - pl.pledged_at < interval '14 days' THEN '7-13d'
    WHEN now() - pl.pledged_at < interval '30 days' THEN '14-29d'
    ELSE '30d+'
  END AS age_bucket,
  count(*) AS pledges,
  sum(pl.pledged_amount) AS pledged_total,
  sum(pl.amount_received) AS received_total,
  sum(pl.pledged_amount - pl.amount_received) AS outstanding_total
FROM cd2.pledges pl
WHERE pl.deleted_at IS NULL
  AND pl.status IN ('pledged','partial')
GROUP BY 1
ORDER BY
  CASE age_bucket
    WHEN '0-6d' THEN 1
    WHEN '7-13d' THEN 2
    WHEN '14-29d' THEN 3
    ELSE 4
  END;

-- Follow-up SLA
CREATE OR REPLACE VIEW cd2.vw_fr_followup_sla AS
SELECT
  count(*) FILTER (WHERE f.deleted_at IS NULL AND f.status IN ('open','in_progress')) AS open_total,
  count(*) FILTER (WHERE f.deleted_at IS NULL AND f.status IN ('open','in_progress') AND f.due_at IS NULL) AS no_due_date,
  count(*) FILTER (WHERE f.deleted_at IS NULL AND f.status IN ('open','in_progress') AND f.due_at IS NOT NULL AND f.due_at < now()) AS overdue,
  count(*) FILTER (WHERE f.deleted_at IS NULL AND f.status IN ('open','in_progress') AND f.due_at IS NOT NULL AND f.due_at >= now() AND f.due_at < now() + interval '48 hours') AS due_48h,
  count(*) FILTER (WHERE f.deleted_at IS NULL AND f.status IN ('open','in_progress') AND f.due_at IS NOT NULL AND f.due_at >= now() + interval '48 hours') AS due_later
FROM cd2.followups f;

-- Next calls queue
CREATE OR REPLACE VIEW cd2.vw_fr_next_calls AS
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
WHERE p.deleted_at IS NULL
  AND d.is_active = true
  AND p.status IN ('queued','active','research','new')
ORDER BY
  (p.next_action_at IS NULL) ASC,
  p.next_action_at ASC NULLS LAST,
  p.last_contact_at ASC NULLS FIRST,
  COALESCE(p.ask_amount_suggested, 0) DESC
LIMIT 25;

-- Events rollup
CREATE OR REPLACE VIEW cd2.vw_fr_events_rollup AS
SELECT
  e.event_id,
  e.name,
  e.event_type,
  e.start_at,
  e.status,
  e.goal_amount,
  count(i.invite_id) FILTER (WHERE i.deleted_at IS NULL) AS invites,
  count(i.invite_id) FILTER (WHERE i.deleted_at IS NULL AND i.invite_status IN ('confirmed')) AS confirmed,
  count(i.invite_id) FILTER (WHERE i.deleted_at IS NULL AND i.invite_status IN ('attended')) AS attended,
  coalesce(sum(i.amount_received) FILTER (WHERE i.deleted_at IS NULL),0) AS received_total
FROM cd2.fundraising_events e
LEFT JOIN cd2.event_invites i ON i.event_id = e.event_id
WHERE e.deleted_at IS NULL
GROUP BY 1,2,3,4,5,6
ORDER BY e.start_at DESC NULLS LAST;

COMMIT;
