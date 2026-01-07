/**
 * PATCH: Ensure WIDGET_VIEW_CONTRACTS reflects non-deleted contract.
 * These views MUST exclude deleted rows (deleted_at IS NULL).
 */
export const WIDGET_VIEW_CONTRACTS_APPEND_MODULE23 = [
  {
    view: "cd2.vw_narrative_top_questions",
    columns: ["day (timestamp)", "tag (text)", "county (text)", "source (text)", "question_count (int)", "last_seen_at (timestamp)"],
    notes: "Excludes deleted rows (q.deleted_at IS NULL)."
  },
  {
    view: "cd2.vw_narrative_confusion_index",
    columns: ["day (timestamp)", "county (text)", "level (text)", "signal_count (int)", "last_seen_at (timestamp)"],
    notes: "Excludes deleted rows (s.deleted_at IS NULL)."
  },
  {
    view: "cd2.vw_cm_stop_doing_active",
    columns: ["item_id (uuid)", "title (text)", "reason (text)", "owner_role (text)", "status (text)", "created_at (timestamp)"],
    notes: "Excludes deleted rows (i.deleted_at IS NULL)."
  },
  {
    view: "cd2.vw_cadence_commitments_open",
    columns: ["commitment_id (uuid)", "window (text)", "title (text)", "description (text)", "owner_role (text)", "status (text)", "due_at (timestamp)", "created_at (timestamp)"],
    notes: "Excludes deleted rows (c.deleted_at IS NULL) and status <> done."
  },
  {
    view: "cd2.vw_audit_with_actor",
    columns: ["audit_id (uuid)", "occurred_at (timestamp)", "actor_user_id (uuid)", "actor_name (text)", "actor_email (text)", "action (text)", "entity_type (text)", "entity_id (text)", "metadata (jsonb)"],
    notes: "Audit explorer projection with actor display fields."
  }
];
