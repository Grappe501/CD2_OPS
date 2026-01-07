## CD2_OPS v1.5.0 — Module 14 (Widget Registry Expansion Skeleton)
- Refactored widget registry into `packages/core/src/widgets/*` per dashboard
- Added baseline KPI widget IDs + stubs aligned to master plan (A/B/C outcomes + finance + field + narrative + decisions/risks/cadence)
- Added policy stubs for `accessRoute` for API widgets (required for parity compiler)
- Added `docs/WIDGET_VIEW_CONTRACTS.md` (contracts doc starter)
- Added patch instructions to extend:
  - `packages/core/src/types.ts` (add accessRoute)
  - `packages/core/src/metrics.ts` (add baseline KPI metric keys)

Checklist:
- [ ] Apply `types.patch.append.ts` to `packages/core/src/types.ts`
- [ ] Apply `metrics.patch.append.ts` to `packages/core/src/metrics.ts`
- [ ] Confirm imports compile (`WidgetDef` path may differ)
- [ ] Run Module 13 parity check:
      - node scripts/generate-form-api-access-map.mjs --write
      - node scripts/check-parity.mjs
- [ ] Confirm dashboards render widget placeholders without view errors (until Module 15 views are built)
