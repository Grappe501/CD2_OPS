## CD2_OPS v3.2.0 — Module 31 (Fundraising HQ polish)
- Added fundraising script system:
  - cd2.fundraising_script_sets
  - cd2.fundraising_ask_ladder
  - cd2.fundraising_objections
- Added views:
  - vw_fr_script_set_active
  - vw_fr_ask_ladder
  - vw_fr_objections
- Added Call Flow enhancements (patch-based):
  - Script panel + ask ladder quick inserts
  - Objection chips (insert note text)
  - On-screen timer hook for duration
  - Deterministic follow-up due date suggestion rules
- Added printable call sheet:
  - Route `/fundraising/callsheet`
  - API `/api/fundraising/callsheet`
  - Print CSS for PDF export

Checklist:
- [ ] Apply migration 020
- [ ] Apply views 034
- [ ] Seed 021 (optional)
- [ ] Patch FrCallFlowModal with script panel + timer + due-date defaults
- [ ] Add call sheet route + API
- [ ] Import CallSheetPrint.css globally
