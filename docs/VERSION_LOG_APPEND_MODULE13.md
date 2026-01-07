## CD2_OPS v1.4.0 — Module 13 (Parity Compiler + Drift Blocker)
- Added generator: scripts/generate-form-api-access-map.mjs
- Added drift check: scripts/check-parity.mjs
- Added generated committed contract:
  - apps/web/src/lib/formApiAccessMap.generated.ts
  - apps/web/src/lib/formApiAccessMap.ts re-exports generated
- Added docs: docs/PARITY_CONTRACT.md

Checklist:
- [ ] Merge module
- [ ] Update Widget Registry: add `accessRoute` next to any `/api/forms/*` widget
- [ ] Run: node scripts/generate-form-api-access-map.mjs --write
- [ ] Commit generated file
- [ ] Add CI step: node scripts/check-parity.mjs
