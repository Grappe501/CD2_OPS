## CD2_OPS v2.9.0 — Module 28 (Fundraising dashboards + widgets)
- Added fundraising dashboard routes:
  - /fundraising/candidate
  - /fundraising/finance
  - /fundraising/followups
  - /fundraising/events
- Added views-first rollups (no UI-side metric math):
  - vw_fr_prospect_display
  - vw_fr_owner_summary_today
  - vw_fr_owner_summary_7d
  - vw_fr_followups_overdue
  - vw_fr_followups_open
  - vw_fr_recent_pledges
  - vw_fr_pipeline_status_lane
- Added widget registry append for fundraising pages:
  - candidate cockpit (today, 7d, next 25 calls)
  - finance (follow-up SLA, pledge aging, lane performance, recent pledges, pipeline)
  - follow-ups (overdue list, open list)
  - events (rollup)
- Added view contract append for new views

Checklist:
- [ ] Apply DB views 031
- [ ] Append view contracts (module28)
- [ ] Add routes (module28)
- [ ] Add widgets (module28)
- [ ] Ensure entitlements allow candidate/finance access appropriately
- [ ] Open /fundraising/candidate and confirm widgets render
