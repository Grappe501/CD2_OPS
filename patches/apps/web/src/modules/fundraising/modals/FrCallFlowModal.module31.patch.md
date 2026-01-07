# Module 31 PATCH: enhance FrCallFlowModal (scripts + objections + timer + due-date suggestions)

## Add imports
- `import { useCallTimer } from "@/modules/fundraising/callflow/useCallTimer";`
- `import { suggestFollowupDueAt } from "@/modules/fundraising/callflow/dueDateSuggest";`
- `import { FrScriptPanel } from "@/modules/fundraising/callflow/FrScriptPanel";`

## Add state
- `const timer = useCallTimer();`

## Timer UI (Call step)
- Add Start/Stop/Reset buttons
- Show live seconds `timer.seconds`
- On Stop: auto-fill `durationSeconds` with `timer.seconds`

## Due-date suggestion (Outcome step)
- When outcome changes, if followupDueAt is empty, set it:
  `setFollowupDueAt(suggestFollowupDueAt(outcome) || "")`

## Script + objections
- Render `<FrScriptPanel ... onInsertText={(t)=>setCallNotes(prev=>prev?prev+"\n"+t:t)} onInsertObjectionNote={(t)=>setCallNotes(prev=>prev?prev+"\n"+t:t)} />`
- You need to fetch script/ladder/objections for the lane. For MVP:
  - pass them in via quickAddContext (if available), OR
  - fetch via a server route (recommended in Module 32) using views:
    - `vw_fr_script_set_active`
    - `vw_fr_ask_ladder`
    - `vw_fr_objections`

## Also recommended
- Add a “Generate AI follow-up draft” shortcut button on the Follow-up step (reuses Module 29 API).
