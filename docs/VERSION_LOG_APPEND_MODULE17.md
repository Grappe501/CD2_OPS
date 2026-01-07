## CD2_OPS v1.8.0 — Module 17 (Stop-Doing + Cadence + Narrative Intake)
- Added Stop-Doing tables + active exceptions model
- Added cadence_commitments table + views for commitments + miss streaks
- Added narrative intake tables:
  - voter questions
  - confusion signals
  - message discipline updates
- Replaced placeholder views with real operational views:
  - v_stop_doing_active
  - v_cadence_commitments
  - v_cadence_miss_streaks
  - v_narrative_confusion
  - v_narrative_top_questions
  - v_message_discipline_status

Checklist:
- [ ] Apply migrations 012–014
- [ ] Apply views 040–042
- [ ] Verify dashboards:
  - CM board shows Stop-Doing list + cadence commitments
  - Narrative dashboard shows confusion + questions + message discipline
- [ ] Confirm audit logs capture inserts/updates via API layer when UI forms are added (Module 18)
