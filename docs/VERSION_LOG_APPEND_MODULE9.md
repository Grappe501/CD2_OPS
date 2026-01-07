## CD2_OPS v1.0.0 — Module 9 (Users + Entitlements + Admin Console)
- Added per-user auth (email+password via bcrypt) + kept legacy role login
- Added tables: cd2.user_credentials, cd2.user_entitlements
- Added Admin User Directory + User Detail Editor (role, active, password reset, entitlements)
- Added admin APIs with audit logging for:
  - user_create, user_update, role_change, user_disable, password_reset
  - grant/revoke entitlements

Notes:
- Middleware cannot safely query Postgres (edge). So entitlement-based overrides are enforced in server APIs/pages in future patch.
  - Admin page access is enforced by role (admin) at middleware + API.
  - Entitlements are stored + audit-logged now.

Checklist:
- [ ] Apply migration 003_users_entitlements.sql
- [ ] `npm i bcryptjs`
- [ ] Login as admin
- [ ] Navigate to /dashboard/admin/users
- [ ] Create a user, set password
- [ ] Login using email mode
- [ ] Grant an entitlement; confirm audit log shows grant/revoke
