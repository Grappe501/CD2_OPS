# CD2_OPS — Parity Contract (LOCKED)

## Purpose
Prevent drift between routes, widgets, and APIs.

## Sources of truth
1) `packages/core/src/widgets.ts` — declares api widgets + their `accessRoute`
2) `apps/web/src/lib/routeMap.ts` — declares which dashboard routes exist + role gates
3) Generated: `apps/web/src/lib/formApiAccessMap.generated.ts`

## Rules (LOCKED)
- Any widget that calls a form API must include:
  - `dataSource: { kind: "api", path: "/api/forms/<name>" }`
  - `accessRoute: "/dashboard/<route>"`  (canonical route for auth)
- Generator fails if:
  - accessRoute isn't present in routeMap
  - conflicting mapping exists for same apiPath
  - accessRoute missing

## Developer workflow
When you add:
- a new form API route
- a new api-backed widget
- a new dashboard route

Run:
- `node scripts/generate-form-api-access-map.mjs --write`
- commit the generated file

CI should run:
- `node scripts/check-parity.mjs`
