# CONTRACT_CHANGES.md
# CD2_OPS — CONTRACT CHANGES (LOCKED)
Append-only record of changes to contracts that can break modules:
- widget IDs
- view names
- metric keys
- routes
- filter contract (URL query params)

**Rules**
1) Append-only.
2) Requires a version bump + rationale.
3) Requires implementation evidence (commit + files updated).
4) Requires verification steps.

---

## Contract Change — YYYY-MM-DD
**Version:** vX.Y.Z  
**Requested By:** <name/role>  
**Approved By:** <name/role>  
**Changed Type:** widget_id / view_name / metric_key / route / filter_contract  
**Severity:** low / medium / high

### Change Summary
**Old:**  
- …

**New:**  
- …

### Reason
- …

### Blast Radius
- Pages:
- Widgets:
- Views:
- APIs:
- Docs:

### Required Updates (checklist)
- [ ] packages/core/src/routes.ts
- [ ] packages/core/src/widgets.ts
- [ ] packages/core/src/metrics.ts
- [ ] packages/core/src/filters.ts
- [ ] packages/db/views/*.sql
- [ ] docs/ROUTES.md
- [ ] docs/WIDGET_REGISTRY.md
- [ ] docs/DATA_CONTRACTS.md
- [ ] docs/METRICS_DICTIONARY.md
- [ ] tests updated
- [ ] VERSION_LOG appended

### Implementation Evidence
**Git Commit:** <short-hash>  
**PR/Branch:** <name/link>  
**Files Changed:**  
- …

### Verification
- [ ] Registry compiles
- [ ] Views load without error
- [ ] Dashboards render
- [ ] Drilldowns preserve filters
- [ ] No orphan references
