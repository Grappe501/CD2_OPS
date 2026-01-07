## CD2_OPS v2.5.0 — Module 24 (Widgets use vw_* views + Empty States + Undo toasts)
- Updated widget registry to point to Module 23 soft-delete-safe views (vw_*)
- Added widget-level emptyState configuration stubs (title/body/actions/thresholds)
- Added renderer patch guidance to display EmptyState coaching when widgets return 0 rows
- Added QuickAdd router param guidance so EmptyState CTA can open the right modal
- Added undo-toasts examples for all eligible modal submissions

Checklist:
- [ ] Apply widget registry patches (dataSource.view updates)
- [ ] Extend WidgetDef type to include emptyState
- [ ] Patch RegistryRenderer to render EmptyState when rows empty
- [ ] Add query-param driven quickAdd open behavior
- [ ] Update modals to use Toast success + Undo action using `/api/forms/undo`
- [ ] Confirm widgets exclude deleted rows via vw_* views
