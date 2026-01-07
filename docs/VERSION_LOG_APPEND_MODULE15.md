## CD2_OPS v1.6.0 — Module 15 (DB Views + Contracts)
- Added Postgres views to power Module 14 widgets (cd2.v_*):
  - outcomes/scorecard + floors
  - finance/runway/call time discipline
  - decisions + risks (real tables)
  - cadence/narrative/field (placeholders for next modules)
  - admin/system views
  - stop-doing placeholder view
- Completed `docs/WIDGET_VIEW_CONTRACTS.md` baseline schemas

Checklist:
- [ ] Merge SQL files into your repo views folder
- [ ] Apply views (per your migration workflow)
- [ ] Confirm dashboards render (no missing-view errors)
- [ ] Confirm decisions + risks widgets show real data from existing tables
