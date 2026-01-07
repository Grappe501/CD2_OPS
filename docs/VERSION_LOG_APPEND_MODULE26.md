## CD2_OPS v2.7.0 — Module 26 (EmptyState CTAs + Help Drawer actions + Tour actions)
- EmptyState CTAs can open modals via QuickAdd deeplinks
- Help Drawer can include “Open this form” action buttons per topic/page
- Guided Tours support optional “Do it now” actions (open modal or navigate)
- Added helper components:
  - RegistryEmptyStateCTA
  - HelpActionButton
  - TourActionButton
- Added patches to wire these into existing renderer/help/tours

Checklist:
- [ ] Apply RegistryRenderer patch to render RegistryEmptyStateCTA
- [ ] Extend helpContent + HelpDrawer to render action buttons
- [ ] Extend TourStep types + TourOverlay to render TourActionButton
- [ ] Add actions to key help topics and tours for Narrative + CM + Cadence pages
