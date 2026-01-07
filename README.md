# CD2_OPS — Module 31 (Fundraising HQ polish: scripts, objections, timer, due-date suggestions, call sheets)
Version: **v3.2.0-module31-fundraising-hq-polish**

## Goal
Turn the Module 30 Call Flow into a **campaign-grade call time station**:
- Lane-specific scripts displayed inside the Call Flow
- Objection buttons that insert proven language into notes (fast + consistent)
- On-screen call timer (start/stop) that fills duration
- Smart due-date defaults (non-AI) + optional AI follow-up draft shortcut
- Printable/Exportable call sheet (PDF-ready HTML) for candidate or call room

---

## What’s included
### DB
- `packages/db/migrations/020_fundraising_scripts_objections.sql`
- `packages/db/views/034_fundraising_scripts_views.sql`

### UI
- `FrScriptPanel` (lane script + ask ladder + quick inserts)
- `FrObjectionChips` (tap to add objection response to notes)
- `useCallTimer` hook + Timer UI
- `dueDateSuggest.ts` helper (rules: talked=24h, vm=48h, no_answer=72h, callback=2h)
- Patch: integrate these into `FrCallFlowModal` (Module 30)
- `CallSheetPage` printable route: `/fundraising/callsheet`

### Export
- `CallSheetPrint.css` for clean printing/PDF save.

---

## Merge instructions
1) Apply DB migration 020
2) Apply DB views 034
3) Merge UI components + patches
4) Add new route `/fundraising/callsheet` and wire nav (optional)
5) Ensure sql helper supports `sql.any` for list views.

