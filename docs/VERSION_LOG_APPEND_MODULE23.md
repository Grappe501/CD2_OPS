## CD2_OPS v2.4.0 — Module 23 (Views exclude deleted + Audit “Show deleted” toggle)
- Added/updated widget-facing views to exclude soft-deleted rows (`deleted_at IS NULL`)
- Added `vw_audit_with_actor` view for consistent audit explorer projection
- Added patches for audit API + audit explorer UI to support `showDeleted=1`
- Added WIDGET_VIEW_CONTRACTS append skeleton for updated views

Checklist:
- [ ] Apply DB views 020 + 021
- [ ] Update widget registry to point to these views (if any widgets still use older views)
- [ ] Patch audit API to filter soft_delete unless showDeleted=1
- [ ] Patch audit explorer UI to toggle showDeleted
- [ ] Run parity compiler if audit API route changed
