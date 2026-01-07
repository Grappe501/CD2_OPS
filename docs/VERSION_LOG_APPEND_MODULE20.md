## CD2_OPS v2.1.0 — Module 20 (Onboarding Wizard + Discord Linking Admin UI)
- Added /onboarding wizard (step-by-step, grandma-friendly)
- Added /admin/discord-links admin UI to link/unlink Discord users to CD2 users
- Added admin helper APIs:
  - GET /api/admin/users (directory search)
  - GET /api/admin/discord/links (list links)
- Added onboarding playbook docs for training and rollout

Checklist:
- [ ] Add new routes to route map + router guard rules (admin-only for /admin/discord-links)
- [ ] Add new APIs to entitlement maps + run parity compiler
- [ ] Verify linking flow end-to-end:
  - search user
  - link Discord user id
  - submit /question in Discord
  - audit explorer shows actor name
