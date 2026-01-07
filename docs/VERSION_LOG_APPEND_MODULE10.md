## CD2_OPS v1.1.0 — Module 10 (Entitlements Enforcement + Audit Actors + Access Simulator)
- Added server-runtime access evaluation (`lib/access.ts`)
- Added `requirePageAccess` / `requireApiAccess` for route-level checks with entitlement overrides
- Upgraded Audit API to join users and return actor_name/role/email
- Upgraded Audit Explorer UI to display actor identity
- Added Effective Access simulator API + UI panel on Admin user detail

Checklist:
- [ ] Merge files
- [ ] Update audit API import usage (remove old requireRole if present)
- [ ] Add EffectiveAccess component to admin user page
- [ ] Login as admin, set entitlement for non-CM user (route:/dashboard/audit)
- [ ] Login as that user; confirm:
      - middleware may still redirect (role), but server page/API should be allowed once you add per-page guards in next step
      - audit API allowed for that user via entitlement (verify directly)
- [ ] Confirm audit explorer shows actor names for rows with actor_user_id present in cd2.users
