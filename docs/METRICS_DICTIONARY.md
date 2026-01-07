# CD2_OPS — METRICS DICTIONARY (Skeleton)

This file defines **canonical meanings** for all metric keys used in widgets and views.
Metric math should live in **views** (or backend endpoints when unavoidable).

## Finance
### finance_runway_days
- **Definition:** Projected days of runway at current burn
- **Source:** cd2.finance_daily_snapshot.projected_runway_days (latest)

### finance_cash_on_hand
- **Definition:** Current cash on hand
- **Source:** cd2.finance_daily_snapshot.cash_on_hand (latest)

### finance_weekly_floor
- **Definition:** Minimum weekly fundraising target
- **Source:** cd2.finance_daily_snapshot.weekly_floor (latest)

### finance_raised_week
- **Definition:** Dollars raised this week (week-to-date)
- **Source:** cd2.finance_daily_snapshot.raised_week (latest)

### finance_calls_made
- **Definition:** Calls made (window)
- **Source:** cd2.call_time_logs.calls_made (sum by filter window)

### finance_connect_rate
- **Definition:** connects / calls_made
- **Source:** cd2.call_time_logs

## Ops/Gov
### ops_decisions_open
- **Definition:** Count of decisions with status open/blocked
- **Source:** cd2.decisions

### ops_decision_latency_days
- **Definition:** Days since requested (or requested→decided)
- **Source:** cd2.decisions timestamps

### ops_risks_triggered
- **Definition:** Count of risks in triggered status
- **Source:** cd2.risks

### ops_cadence_miss_streak
- **Definition:** Consecutive misses for a cadence commitment
- **Source:** cd2.cadence_commitments.miss_streak

## Field
### field_county_pace
- **Definition:** County pace % toward field targets (placeholder)
- **Source:** cd2.field_coverage_snapshot.county_pace_pct

### field_precinct_coverage
- **Definition:** % precinct coverage by lead assignment (placeholder)
- **Source:** cd2.field_coverage_snapshot.precinct_lead_coverage_pct

## Narrative
### narrative_confusion_index
- **Definition:** Composite confusion measure (placeholder)
- **Source:** cd2.v_narrative_confusion.confusion_index (placeholder)
