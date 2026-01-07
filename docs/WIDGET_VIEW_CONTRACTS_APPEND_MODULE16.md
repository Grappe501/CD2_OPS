# Module 16 — Contract Updates (Append)

## Why
Module 16 makes the **finance + call time KPIs real** by adding:
- donors/pledges/contributions/followups
- call_time_logs enhancements (live_hours + ask discipline fields)
- computed views for pipeline + SLA + dollars/hour + tripwires
- compat views for decisions/risk fields expected by Module 14 widgets

## Views updated/created
- `cd2.v_donor_pipeline_stages` (real)
- `cd2.v_followups_sla_queue` / `cd2.v_followups_queue` (real)
- `cd2.v_call_time_discipline` (real computation)
- `cd2.v_call_time_dollars_per_hour_trend` (real computation)
- `cd2.v_finance_tripwires` (first-pass tripwires)
- `cd2.v_decisions_queue*` (compat: adds decision_class)
- `cd2.v_risk_register*` (compat: adds heat)

## New/Updated Columns
### cd2.call_time_logs
- `live_hours numeric(8,2) NOT NULL DEFAULT 0`
- `asked_amount numeric(14,2) NULL`
- `asked_timeline text NULL`
- `followup_scheduled boolean NOT NULL DEFAULT false`
- `followup_id uuid NULL`

### New tables
- `cd2.donors`
- `cd2.pledges`
- `cd2.contributions`
- `cd2.followups`

## KPI definitions (locked for now; refine later)
- **fundraising_dollars_per_hour**: SUM(dollars_raised) / SUM(live_hours) for current week
- **followup_sla_48h_pct**: 1 - (open overdue followups / open followups)  (simple actionable SLA)
- **ask_discipline_compliance_pct**: % of call logs with asked_amount + asked_timeline + followup_scheduled=true
- **tripwire_followups_slip**: overdue followups >= 5 (tune threshold to memo)
- **tripwire_dollars_per_hour_drop**: dph < 100 (tune baseline to memo)
