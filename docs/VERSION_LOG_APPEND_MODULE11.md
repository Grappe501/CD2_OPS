## CD2_OPS v1.2.0 — Module 11 (Entitlements Router Strategy)
- Middleware changed to AUTH-ONLY for /dashboard/* and /api/forms/*
  - JWT required
  - NO role blocking for standard dashboards (enables entitlement overrides)
  - Admin routes still blocked at edge for non-admin
- Added per-route guard layouts using `requirePageAccess("<route>")`
  - Enforces role + entitlements at server runtime
  - Redirects forbidden users to `/dashboard/unauthorized?from=<route>`

Checklist:
- [ ] Merge middleware + layouts
- [ ] Confirm login required for /dashboard/*
- [ ] Create finance user, grant entitlement `route:/dashboard/audit`
- [ ] Login as finance user:
      - /dashboard/audit should now load (no middleware block)
- [ ] Confirm admin-only:
      - non-admin cannot open /dashboard/admin/users
- [ ] Add requireApiAccess guards to all form APIs
