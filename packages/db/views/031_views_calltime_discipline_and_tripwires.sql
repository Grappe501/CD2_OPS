-- CD2_OPS — Call Time discipline + Tripwires (Module 16)
BEGIN;

CREATE SCHEMA IF NOT EXISTS cd2;

-- dollars/hour and ask discipline compliance computed for current week
CREATE OR REPLACE VIEW cd2.v_call_time_discipline AS
WITH w AS (
  SELECT date_trunc('week', cd2.as_of_now())::date AS week_start
),
agg AS (
  SELECT
    (SELECT week_start FROM w) AS week_start,
    SUM(ct.live_hours)::numeric AS live_hours,
    SUM(ct.dollars_raised)::numeric AS dollars_raised,
    SUM(ct.calls_made)::int AS calls_made,
    SUM(ct.connects)::int AS connects,
    -- ask discipline: asked_amount IS NOT NULL AND asked_timeline IS NOT NULL AND followup_scheduled=true
    AVG(
      CASE
        WHEN ct.asked_amount IS NOT NULL AND ct.asked_timeline IS NOT NULL AND ct.followup_scheduled = true THEN 1
        ELSE 0
      END
    )::numeric AS ask_discipline_rate
  FROM cd2.call_time_logs ct
  WHERE ct.call_date >= (SELECT week_start FROM w)
)
SELECT
  cd2.as_of_now() AS as_of,
  agg.week_start,
  NULL::text AS lane,
  COALESCE(agg.live_hours,0)::numeric AS call_time_live_hours_wtd,
  24::numeric AS call_time_live_hours_goal,
  CASE WHEN COALESCE(agg.live_hours,0) = 0 THEN NULL
       ELSE (agg.dollars_raised / NULLIF(agg.live_hours,0)) END::numeric AS fundraising_dollars_per_hour,
  -- SLA: % of open followups not overdue (simple but actionable)
  (
    CASE
      WHEN (SELECT COUNT(*) FROM cd2.followups f WHERE f.is_active=true AND f.status='open') = 0 THEN 1
      ELSE
        1 - (
          (SELECT COUNT(*) FROM cd2.followups f WHERE f.is_active=true AND f.status='open' AND f.due_at < cd2.as_of_now())::numeric
          / NULLIF((SELECT COUNT(*) FROM cd2.followups f WHERE f.is_active=true AND f.status='open')::numeric,0)
        )
    END
  )::numeric AS followup_sla_48h_pct,
  COALESCE(agg.ask_discipline_rate,0)::numeric AS ask_discipline_compliance_pct;

-- dollars/hour weekly trend (last 12 weeks)
CREATE OR REPLACE VIEW cd2.v_call_time_dollars_per_hour_trend AS
WITH weeks AS (
  SELECT generate_series(
    date_trunc('week', cd2.as_of_now())::date - interval '11 weeks',
    date_trunc('week', cd2.as_of_now())::date,
    interval '1 week'
  )::date AS week_start
),
agg AS (
  SELECT
    date_trunc('week', ct.call_date)::date AS week_start,
    SUM(ct.live_hours)::numeric AS live_hours,
    SUM(ct.dollars_raised)::numeric AS dollars_raised
  FROM cd2.call_time_logs ct
  WHERE ct.call_date >= (date_trunc('week', cd2.as_of_now())::date - interval '11 weeks')
  GROUP BY 1
)
SELECT
  w.week_start,
  cd2.as_of_now() AS as_of,
  CASE WHEN COALESCE(a.live_hours,0)=0 THEN NULL
       ELSE (a.dollars_raised / NULLIF(a.live_hours,0)) END::numeric AS fundraising_dollars_per_hour
FROM weeks w
LEFT JOIN agg a ON a.week_start = w.week_start
ORDER BY w.week_start;

-- Tripwires panel (simple first-pass; refine later to match memo thresholds precisely)
CREATE OR REPLACE VIEW cd2.v_finance_tripwires AS
WITH stats AS (
  SELECT
    (SELECT fundraising_dollars_per_hour FROM cd2.v_call_time_discipline LIMIT 1) AS dph,
    (SELECT followup_sla_48h_pct FROM cd2.v_call_time_discipline LIMIT 1) AS sla,
    (SELECT COUNT(*) FROM cd2.followups f WHERE f.is_active=true AND f.status='open' AND f.due_at < cd2.as_of_now()) AS overdue_followups
)
SELECT
  cd2.as_of_now() AS as_of,
  date_trunc('week', cd2.as_of_now())::date AS week_start,
  (stats.overdue_followups >= 5) AS tripwire_followups_slip,
  (stats.dph IS NOT NULL AND stats.dph < 100) AS tripwire_dollars_per_hour_drop, -- TODO: set to your memo baseline
  false AS tripwire_candidate_energy_drain, -- TODO: add candidate check-in table
  false AS tripwire_next_week_money_unclear, -- TODO: add weekly money clarity signal
  CASE
    WHEN (stats.overdue_followups >= 5) THEN 'Tighten targeting, clear follow-up queue within 24h, reduce new prospecting until SLA recovers.'
    WHEN (stats.dph IS NOT NULL AND stats.dph < 100) THEN 'Reduce volume, prioritize higher-fit donors, ensure every call includes a clear ask + scheduled follow-up.'
    ELSE NULL
  END AS recommended_response
FROM stats;

COMMIT;
