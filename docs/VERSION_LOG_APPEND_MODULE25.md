## CD2_OPS v2.6.0 — Module 25 (QuickAdd deeplinks + ToastRoot + modal upgrades)
- Implemented QuickAddHost: query param `?quickAdd=` opens the right modal on any page
- Added AppShell patch to include ToastRoot + QuickAddHost globally
- Added drop-in modal implementations for:
  - Narrative question
  - Confusion signal
  - Stop-doing item
  - Cadence commitment
- All modals now:
  - validate inline
  - show success toast
  - include Undo action (where allowed)
  - show loading state and friendly failure toast

Checklist:
- [ ] Patch AppShell to wrap with ToastRoot and include QuickAddHost
- [ ] Ensure modal imports/paths match your repo structure
- [ ] Add `/api/forms/undo` to API access maps if not already
- [ ] Verify deeplink:
  - open /dashboard/narrative?quickAdd=narrative_question
  - modal opens automatically and closes cleanly
