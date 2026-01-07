## CD2_OPS v0.8.0 — Module 7 (Role Nav + Topbar + Audit Explorer)
- Added NAV contract (`packages/core/src/nav.ts`) with role gating
- Added dashboard layout shell with:
  - role-aware left rail + mobile menu
  - topbar session chip + logout
- Added Audit Explorer page with filters + drilldowns
- Upgraded audit API to support filter query params

Checklist:
- [ ] Merge files
- [ ] Ensure Module 6 auth works (login)
- [ ] Confirm /dashboard renders with left rail
- [ ] Confirm /dashboard/audit loads and filters work (CM/Admin only)
- [ ] Confirm "Logout" clears cookie and redirects to /login
