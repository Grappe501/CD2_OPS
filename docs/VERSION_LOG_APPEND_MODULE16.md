## CD2_OPS v1.7.0 — Module 16 (Fundraising Pipeline + Follow-ups + Tripwires)
- Added fundraising pipeline tables: donors, pledges, contributions, followups
- Enhanced call_time_logs with live_hours + ask discipline fields
- Implemented computed views:
  - donor pipeline stages
  - follow-ups SLA queue
  - call time discipline KPIs
  - dollars/hour trend
  - finance tripwires panel
- Added compatibility views to satisfy Module 14 widget contracts:
  - decisions_queue adds decision_class derived from priority
  - risk_register adds heat derived from status

Checklist:
- [ ] Apply migrations 010 and 011
- [ ] Apply views 030–032
- [ ] Run seed 010 (optional)
- [ ] Verify dashboards:
  - Finance: pipeline + followups + tripwires populate
  - Call Time: dollars/hour trend shows
  - Decisions/Risks: class + heat columns appear without UI changes
