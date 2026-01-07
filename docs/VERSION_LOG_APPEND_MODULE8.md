## CD2_OPS v0.9.0 — Module 8 (Route-level RBAC)
- Added route RBAC contract: `apps/web/src/lib/routeMap.ts`
- Upgraded middleware to validate JWT + enforce allowed roles per dashboard route
- Added server-side helpers for per-page/per-API role checks (`routeAuth.ts`)
- Added `/dashboard/unauthorized` page

Checklist:
- [ ] Ensure AUTH_SECRET is set in env (required for middleware verify)
- [ ] Merge files
- [ ] Login as CM, confirm access:
      - /dashboard/cm OK
      - /dashboard/finance OK
      - /dashboard/audit OK
- [ ] Login as Finance, confirm:
      - /dashboard/finance OK
      - /dashboard/audit redirects to unauthorized
- [ ] Paste a forbidden URL while logged in; confirm redirect
