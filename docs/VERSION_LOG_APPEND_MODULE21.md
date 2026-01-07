## CD2_OPS v2.2.0 — Module 21 (UX + A11y Hardening + Help + Tours)
- Added A11y utilities: FocusTrap + VisuallyHidden
- Added persistent Help Drawer (always available) with route-aware help topics
- Added Guided Tours framework (TourProvider + TourOverlay + tour definitions)
- Added Display preferences (Large Type + High Contrast) persisted in localStorage
- Added AppShell wrapper to enable the above everywhere (patch instructions)

Checklist:
- [ ] Wrap root layout with AppShell
- [ ] Append globals CSS for large type + high contrast
- [ ] Verify:
  - Help opens/closes, traps focus, ESC works
  - Guided tour runs on Narrative and CM pages
  - Display toggles persist after refresh
