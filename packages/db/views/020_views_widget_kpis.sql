-- CD2_OPS — Views for baseline KPI widgets (Module 14)
-- Version: v1.6.0
-- Schema: cd2

BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;

-- Minimal helper for consistent timestamps
CREATE OR REPLACE FUNCTION cd2.as_of_now()
RETURNS timestamptz
LANGUAGE sql
AS $$ SELECT now(); $$;

-- =================
-- Outcomes / Scorecard
-- =================

CREATE OR REPLACE VIEW cd2.v_outcomes_abc_status AS
SELECT
  cd2.as_of_now() AS as_of,
  'on_track'::text AS outcome_a_status,
  'on_track'::text AS outcome_b_status,
  'on_track'::text AS outcome_c_status,
  COALESCE((SELECT COUNT(*) FROM cd2.risks r WHERE r.is_active = true AND r.status = 'open' AND r.heat = 'heating'), 0)::int AS risks_heating_count;

CREATE OR REPLACE VIEW cd2.v_weekly_scorecard AS
SELECT
  date_trunc('week', cd2.as_of_now())::date AS week_start,
  cd2.as_of_now() AS as_of,
  'on_track'::text AS outcome_a_status,
  'on_track'::text AS outcome_b_status,
  'on_track'::text AS outcome_c_status,
  52000::int AS floor_primary_votes_total,
  65000::int AS floor_primary_turnout_total,
  0.80::numeric AS floor_primary_vote_share_pct,
  30000::int AS floor_primary_pulaski_votes,
  NULL::int AS primary_votes_total,
  NULL::int AS primary_turnout_total,
  NULL::numeric AS primary_vote_share_pct,
  NULL::int AS primary_pulaski_votes,
  NULL::numeric AS fundraising_cash_on_hand_weeks,
  NULL::numeric AS fundraising_weekly_raised,
  NULL::numeric AS fundraising_weekly_floor,
  NULL::text AS confusion_index,
  NULL::text AS message_discipline_status;

CREATE OR REPLACE VIEW cd2.v_outcome_floors_progress AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::text AS county,
  52000::int AS floor_primary_votes_total,
  65000::int AS floor_primary_turnout_total,
  0.80::numeric AS floor_primary_vote_share_pct,
  30000::int AS floor_primary_pulaski_votes,
  NULL::int AS primary_votes_total,
  NULL::int AS primary_turnout_total,
  NULL::numeric AS primary_vote_share_pct,
  NULL::int AS primary_pulaski_votes;

-- =================
-- Finance / Runway / Call Time
-- =================

CREATE OR REPLACE VIEW cd2.v_finance_runway AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::numeric AS fundraising_cash_on_hand_weeks,
  NULL::numeric AS fundraising_weekly_raised,
  NULL::numeric AS fundraising_weekly_floor,
  NULL::numeric AS burn_rate_weekly,
  NULL::numeric AS runway_weeks_at_current_burn;

CREATE OR REPLACE VIEW cd2.v_finance_runway_calltime AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::numeric AS fundraising_cash_on_hand_weeks,
  COALESCE((
    SELECT SUM(ct.live_hours)
    FROM cd2.call_time_logs ct
    WHERE ct.is_active = true
      AND ct.call_date >= date_trunc('week', cd2.as_of_now())::date
  ), 0)::numeric AS call_time_live_hours_wtd,
  24::numeric AS call_time_live_hours_goal;

CREATE OR REPLACE VIEW cd2.v_call_time_discipline AS
SELECT
  cd2.as_of_now() AS as_of,
  date_trunc('week', cd2.as_of_now())::date AS week_start,
  NULL::text AS lane,
  COALESCE((
    SELECT SUM(ct.live_hours)
    FROM cd2.call_time_logs ct
    WHERE ct.is_active = true
      AND ct.call_date >= date_trunc('week', cd2.as_of_now())::date
  ), 0)::numeric AS call_time_live_hours_wtd,
  24::numeric AS call_time_live_hours_goal,
  NULL::numeric AS fundraising_dollars_per_hour,
  NULL::numeric AS followup_sla_48h_pct,
  NULL::numeric AS ask_discipline_compliance_pct;

CREATE OR REPLACE VIEW cd2.v_call_time_dollars_per_hour_trend AS
SELECT
  date_trunc('week', cd2.as_of_now())::date AS week_start,
  cd2.as_of_now() AS as_of,
  NULL::numeric AS fundraising_dollars_per_hour;

CREATE OR REPLACE VIEW cd2.v_followups_sla_queue AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::uuid AS followup_id,
  NULL::text AS contact_name,
  NULL::text AS lane,
  NULL::timestamptz AS due_at,
  NULL::int AS minutes_overdue,
  NULL::text AS owner_user_id
WHERE false;

CREATE OR REPLACE VIEW cd2.v_followups_queue AS
SELECT * FROM cd2.v_followups_sla_queue;

CREATE OR REPLACE VIEW cd2.v_finance_tripwires AS
SELECT
  cd2.as_of_now() AS as_of,
  date_trunc('week', cd2.as_of_now())::date AS week_start,
  false AS tripwire_followups_slip,
  false AS tripwire_dollars_per_hour_drop,
  false AS tripwire_candidate_energy_drain,
  false AS tripwire_next_week_money_unclear,
  NULL::text AS recommended_response;

CREATE OR REPLACE VIEW cd2.v_donor_pipeline_stages AS
SELECT
  cd2.as_of_now() AS as_of,
  'prospect'::text AS stage,
  0::int AS count_contacts,
  0::numeric AS amount_expected
WHERE false;

-- =================
-- Call Time blocks / lane-of-day / scripts
-- =================

CREATE OR REPLACE VIEW cd2.v_call_blocks_calendar AS
SELECT
  cd2.as_of_now() AS as_of,
  date_trunc('day', cd2.as_of_now())::date AS day,
  0::int AS blocks_planned,
  0::int AS blocks_completed,
  0::numeric AS hours_planned,
  0::numeric AS hours_completed;

CREATE OR REPLACE VIEW cd2.v_call_time_lane_of_day AS
SELECT
  cd2.as_of_now() AS as_of,
  EXTRACT(DOW FROM cd2.as_of_now())::int AS day_of_week,
  'followups'::text AS lane,
  'default'::text AS script_key;

CREATE OR REPLACE VIEW cd2.v_call_time_scripts_by_lane AS
SELECT
  cd2.as_of_now() AS as_of,
  'followups'::text AS lane,
  'default'::text AS script_key,
  'TODO: load scripts into table and back this view.'::text AS script_text;

-- =================
-- Next actions (candidate-safe)
-- =================

CREATE OR REPLACE VIEW cd2.v_next_actions_candidate AS
SELECT
  cd2.as_of_now() AS as_of,
  NULL::uuid AS action_id,
  NULL::text AS title,
  NULL::text AS owner_role,
  NULL::timestamptz AS due_at,
  NULL::text AS status
WHERE false;

COMMIT;
