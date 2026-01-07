# Module 17 — Contract Updates (Append)

## Why
Module 17 replaces placeholders so CM board + Narrative dashboards show **real operational truth**.

## Views now REAL (no longer placeholders)
- `cd2.v_stop_doing_active`
- `cd2.v_cadence_commitments`
- `cd2.v_cadence_miss_streaks`
- `cd2.v_narrative_confusion`
- `cd2.v_narrative_top_questions`
- `cd2.v_message_discipline_status`

## New tables feeding these views
- `cd2.stop_doing_items`
- `cd2.stop_doing_exceptions`
- `cd2.cadence_commitments`
- `cd2.narrative_questions`
- `cd2.narrative_confusion_signals`
- `cd2.message_discipline_updates`

## KPI definitions
- **Stop-Doing Active**: all `stop_doing_items.status='active'` with `active_exceptions` count
- **Cadence commitments**: commitments ordered by due date; `hours_past_due` indicates slip
- **Cadence miss streaks**: first-pass = missed count in last 60 days per owner_role (upgrade later to true streak logic)
- **Confusion index**: highest level observed in current week per county; `top_confusion_theme` = most frequent theme
- **Top questions**: count mentions of identical question text in current week (limit 25)
- **Message discipline**: most recent update row
