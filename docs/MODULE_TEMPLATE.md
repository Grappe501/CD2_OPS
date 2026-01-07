# MODULE_TEMPLATE.md
# CD2_OPS — MODULE DEFINITION TEMPLATE (LOCKED)

## Module Name
**Module #:**  
**Module Title:**  
**Version Target:** vX.Y.Z-<module-name>  
**Owner Role:** cm / finance / field / comms / data / admin

---

## 1) Purpose (Decisions Enabled)
- Primary decision enabled:
- Secondary decisions enabled:

---

## 2) Scope
### Pages
- /dashboard/…
- /dashboard/…/[id]

### Widgets (by id)
- …

### Data Contracts
Views required:
- v_…

Tables written:
- …

APIs:
- GET /api/…
- POST /api/…

---

## 3) Definitions (No ambiguity)
### Metrics used/added
For each:
- Metric key:
- Definition:
- Numerator/Denominator:
- Time window:
- Owner:
- Thresholds:
- Display format:

### Status logic
- stable/heating/triggered rules (if relevant)
- floors / streaks (if relevant)

---

## 4) UX Requirements (Luxury UI)
- layout
- empty states
- filters + drilldowns (preserve URL params)
- “red means do this next” CTA

---

## 5) Non-Goals
- …

---

## 6) Acceptance Criteria (Done = Done)
- [ ] UI complete
- [ ] Views validated
- [ ] APIs complete
- [ ] Drilldowns confirmed
- [ ] Empty states confirmed
- [ ] Tests pass (smoke)
- [ ] VERSION_LOG appended
- [ ] BUILD_CHECKLIST updated
- [ ] Snapshot created
- [ ] Zip release created

---

## 7) Test Plan
- smoke tests
- data correctness checks
- RBAC checks

---
