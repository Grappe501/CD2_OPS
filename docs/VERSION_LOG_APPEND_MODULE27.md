## CD2_OPS v2.8.0 — Module 27 (Fundraising DB + KPI views)
- Added fundraising core schema:
  - fundraising_lanes, donors, fundraising_prospects
  - call_sessions, call_attempts
  - pledges, followups
  - fundraising_events, event_invites
- Added KPI view layer:
  - vw_fr_call_time_daily
  - vw_fr_lane_performance
  - vw_fr_pledge_aging
  - vw_fr_followup_sla
  - vw_fr_next_calls
  - vw_fr_events_rollup
- Views exclude soft-deleted rows by default
- Added seed data for demo realism
- Added WIDGET_VIEW_CONTRACTS append skeleton for all fundraising views

Checklist:
- [ ] Apply migration 017
- [ ] Apply views 030
- [ ] Append contract rows (module27)
- [ ] (Optional) seed 020
- [ ] Confirm DB search_path includes cd2 in runtime config
