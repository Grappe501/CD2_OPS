## CD2_OPS v0.7.0 — Module 6 (Auth/RBAC + Workflows)
- Added JWT cookie auth + login route
- Added middleware protection for dashboards + forms API
- Added role-based API gates (CM/Admin editing)
- Added actor_user_id attribution to audit log for all writes
- Added decision/risk PATCH edit/close workflows + UI edit panels
- Optional DB migration adds cd2.users for stable user_id attribution

Checklist:
- [ ] Add env vars: AUTH_SECRET + AUTH_*_PASSWORD
- [ ] `npm i jose`
- [ ] Apply DB migration 002_auth_users.sql (optional but recommended)
- [ ] Visit /login and sign in (cm/admin)
- [ ] Create + edit + close a decision; verify /api/forms/audit shows actor_user_id
- [ ] Create + edit + mitigate a risk; verify /api/forms/audit shows actor_user_id
