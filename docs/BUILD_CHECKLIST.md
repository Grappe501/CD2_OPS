# BUILD_CHECKLIST.md
# CD2_OPS — MASTER BUILD CHECKLIST

This checklist tracks everything required to complete CD2_OPS.
Checked items are complete and merged. Unchecked items remain.

---

## PHASE 0 — ARCHITECTURE (LOCKED)
- [x] System name finalized (CD2_OPS)
- [x] Master architecture locked
- [x] Widget registry locked
- [x] Routes map locked
- [x] Metrics keys locked
- [x] Global filter contract locked
- [x] Database views contract locked
- [ ] docs/CONTRACT_CHANGES.md created + committed
- [ ] docs/ALERT_CHANNELS.md created + committed
- [ ] docs/AI_CHARTER.md created + committed
- [ ] docs/MODULE_TEMPLATE.md created + committed
- [ ] Operational scripts added (/scripts) + committed
- [ ] “Widget metadata gate” added to BUILD_PROTOCOL + enforced

---

## PHASE 1 — APPLICATION SCAFFOLD (MODULE 0)
- [ ] Repo initialized
- [ ] Next.js app scaffolded
- [ ] Tailwind + CSS variables theme
- [ ] Premium UI shell (nav, header, cards, typography)
- [ ] Role-based nav rendering
- [ ] Global filter bar (URL-based)
- [ ] DashboardCard + WidgetFrame components
- [ ] Registry-driven page renderer
- [ ] All dashboard pages exist (route stubs generated)
- [ ] All widget stubs exist (generated)
- [ ] System Health page stub
- [ ] Integration stubs:
  - [ ] OpenAI stub endpoints
  - [ ] Census stub endpoints
  - [ ] BLS stub endpoints
  - [ ] Discord stub endpoints
  - [ ] Google Calendar stub endpoints
- [ ] VERSION_LOG initialized + committed
- [ ] BUILD_CHECKLIST committed
- [ ] Snapshot script run + snapshot committed (optional)
- [ ] Zip release created (releases/)

---

## PHASE 2 — DATABASE FOUNDATION (MODULE 1)
- [ ] Postgres connected locally
- [ ] Base schema migrations applied
- [ ] All dashboard views created (skeleton)
- [ ] View skeleton validated (SQL loads without error)
- [ ] Seed data created (realistic)
- [ ] DB reset/migrate scripts working

---

## PHASE 3 — CORE DASHBOARDS

### Module 2 — Candidate Cockpit
- [ ] Outcome tiles
- [ ] Runway widget
- [ ] Risk snapshot
- [ ] Decisions queue
- [ ] Call time protection
- [ ] Presence snapshot
- [ ] Readiness widget
- [ ] Drilldowns wired

### Module 3 — CM Operating Board
- [ ] Weekly scorecard builder
- [ ] Risk heatboard
- [ ] Decisions kanban
- [ ] Cadence commitments
- [ ] Stop Doing list
- [ ] Finance mix summary
- [ ] Narrative signals summary

### Module 4 — Finance Command
- [ ] Runway + floor
- [ ] Call time performance
- [ ] Follow-up queue
- [ ] Channel mix scoreboard
- [ ] Bundler performance
- [ ] Donor detail pages
- [ ] Bundler detail pages
- [ ] Concentration risk widget (top donors/channels)

---

## PHASE 4 — FIELD + NARRATIVE

### Module 5 — Field Command
- [ ] Precinct lead coverage
- [ ] County pace board
- [ ] Precinct heat list
- [ ] Ballot funnel
- [ ] Presence outputs
- [ ] County detail pages
- [ ] Precinct detail pages

### Module 6 — Narrative & Trust
- [ ] Confusion signal
- [ ] AskHumans themes
- [ ] Top questions
- [ ] Message frames library
- [ ] Prompt detail pages
- [ ] Turnout friction index widget

---

## PHASE 5 — GOVERNANCE + CONTROL

### Module 7 — Decisions System
- [ ] Decision creation flow
- [ ] Tradeoff enforcement
- [ ] Decision detail page
- [ ] Approval logging
- [ ] Audit history
- [ ] Decision latency tracking (requested/first_review/decided)

### Module 8 — Risk System
- [ ] Risk definitions
- [ ] Signal thresholds
- [ ] Escalation rules
- [ ] Risk detail pages
- [ ] Action tracking
- [ ] Discord alerts wired to ALERT_CHANNELS

### Module 9 — Cadence Control
- [ ] Cadence types defined
- [ ] Commitments UI
- [ ] Completion tracking
- [ ] Missed-in-a-row logic
- [ ] Enforcement alerts

---

## PHASE 6 — DATA ENTRY

### Module 10 — Data Entry Hub
- [ ] Call time entry
- [ ] Donor call entry
- [ ] AskHumans entry
- [ ] Presence event entry
- [ ] Mobile optimization

---

## PHASE 7 — ADMIN + INTELLIGENCE

### Module 11 — Admin Console
- [ ] Floors editor
- [ ] Threshold editor
- [ ] Metric weights
- [ ] Tag dictionaries
- [ ] User management
- [ ] RBAC hardening

### Module 12 — OpenAI Intelligence
- [ ] Prompt files versioned in repo
- [ ] AI run logging (`ai_runs`)
- [ ] AI suggestions table (`ai_suggestions`)
- [ ] Weekly brief drafting
- [ ] AskHumans auto-tagging
- [ ] Risk insight generation
- [ ] Approval workflow (required)
- [ ] “AI cannot publish” enforced

---

## PHASE 8 — EXTERNAL DATA + AUTOMATION

### Module 13 — Census + BLS
- [ ] Ingestion jobs (scheduled)
- [ ] Snapshot storage tables
- [ ] District context views + widgets

### Module 14 — Discord + Google Calendar
- [ ] Discord intake
- [ ] Discord notifications
- [ ] Google Calendar sync
- [ ] Calendar embeds in dashboards
- [ ] Integration health checks on System Health

---

## PHASE 9 — HARDENING & RELEASE
- [ ] Performance tuning
- [ ] Indexing and query optimization
- [ ] Security review
- [ ] Role access testing
- [ ] Backup strategy
- [ ] Production deployment
- [ ] Documentation complete
