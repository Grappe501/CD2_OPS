# CD2_OPS — Undo Rules (Module 22)

## Why Undo exists
Non-technical users make mistakes. Undo prevents shame + fear and increases usage.

## Undo policy
- Soft-delete only (never hard delete)
- Time-limited:
  - `UNDO_WINDOW_MIN` (default 10 minutes)
- Only these entities:
  - narrative_question
  - narrative_confusion_signal
  - stop_doing_item
  - cadence_commitment

## What undo does
- sets `deleted_at = now()`
- sets `deleted_by_user_id = actor_user_id`
- writes an audit event: action = soft_delete

## What undo does NOT do (yet)
- restore (un-delete)
- undo complex workflows (decisions/risks)
- undo edits (only newly created records)
