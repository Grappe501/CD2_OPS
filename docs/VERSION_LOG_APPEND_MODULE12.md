## CD2_OPS v1.3.0 — Module 12 (API Parity + Access Tests)
- Added `lib/apiGuards.ts` for standardized API enforcement + error handling
- Added `lib/formApiAccessMap.ts` as the parity contract
- Added `scripts/check-api-guards.mjs` to detect missing guards in /api/forms/*
- Added provider-injected access evaluator + Node-native tests:
  - `tests/access.test.mjs`

Checklist:
- [ ] Merge files
- [ ] Add to package scripts:
      - "test:access": "node --test tests/access.test.mjs"
      - "check:api-guards": "node scripts/check-api-guards.mjs"
- [ ] Run:
      - node scripts/check-api-guards.mjs
      - node --test tests/access.test.mjs
- [ ] Apply enforceApiAccess to every /api/forms/* route handler
