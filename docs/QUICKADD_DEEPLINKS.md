# CD2_OPS — QuickAdd Deeplinks (Module 25)

## Why
Empty-state CTAs and Help content can open the right modal instantly without making users hunt.

## Format
Add a query param:
- `?quickAdd=narrative_question`
- `?quickAdd=narrative_confusion`
- `?quickAdd=stop_doing`
- `?quickAdd=cadence`

Example:
- `/dashboard/narrative?quickAdd=narrative_question`

## How it works
QuickAddHost reads `quickAdd` and renders the matching modal `open=true`.
When closed, the param is removed via `router.replace()` (no page reload).

## UX pattern
- EmptyState CTA uses the deeplink
- Help Drawer can include a “Add now” link
- Guided tours can trigger deeplink (optional future)

