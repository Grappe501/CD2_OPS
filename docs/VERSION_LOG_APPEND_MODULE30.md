## CD2_OPS v3.1.0 — Module 30 (Unified Call Flow + Elder-friendly mode)
- Added per-user preference table + view:
  - cd2.user_preferences
  - vw_user_preferences
- Added atomic fundraising endpoint:
  - POST /api/forms/fundraising/log-callflow (transactional)
- Added unified Call Flow stepper modal:
  - FrCallFlowModal
  - Keyboard shortcuts (outcome 1–7, Enter to advance)
  - Auto-followup title when pledge exists
- Added Elder Mode:
  - UiPrefsProvider + useUiPrefs store (local storage MVP)
  - global `data-elder=true` switch + elder-mode.css
  - Topbar toggle patch
- Added patches:
  - QuickAddHost supports `fr_call_flow`
  - Next Calls actions open Call Flow

Checklist:
- [ ] Apply migration 019
- [ ] Apply views 033
- [ ] Implement sql.tx wrapper if missing
- [ ] Wire UiPrefsProvider in root layout
- [ ] Import elder-mode.css globally
- [ ] Wire QuickAddHost case `fr_call_flow`
- [ ] Update Next Calls row actions to use call flow
- [ ] Manual QA: do a full call flow in under 30 seconds
