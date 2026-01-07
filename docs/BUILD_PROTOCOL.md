# BUILD_PROTOCOL.md
# CD2_OPS — BUILD PROTOCOL (LOCKED)
**Purpose:** Define the build protocol for CD2_OPS so development remains fast, modular, consistent, and migration-safe across ChatGPT threads.

**Owner:** Steve Grappe  
**Local Dev:** Cursor  
**Repo:** GitHub → Netlify Deploy  
**System Name (Locked):** CD2_OPS

---

## 0) Source-of-Truth Hierarchy (LOCKED)
When anything conflicts, truth resolves in this order:
1) **Postgres Views** (truth of numbers)
2) **Widget Registry** (what appears, where, data sources)
3) **Metrics Dictionary** (definitions + thresholds)
4) **UI** (presentation only)
5) **AI** (advisory only; never canonical)

---

## 1) System Mission
CD2_OPS is a campaign operating system that provides:
- a single source of truth for campaign execution
- role-based dashboards and workflows
- discipline enforcement (cadence, floors, tradeoffs)
- intelligence via OpenAI (guardrailed, audit-logged)
- external context via Census + BLS snapshots
- automation via Discord bots/webhooks
- schedule truth via Google Calendar sync

---

## 2) Tech Stack (LOCKED)

### 2.1 Frontend
- **Framework:** Next.js (TypeScript)
- **Styling:** Tailwind CSS + CSS Variables for brand theming
- **UI Primitives:** shadcn/ui (preferred) or Radix UI (allowed)
- **Charts:** ECharts (preferred) or Recharts (allowed)
- **Routing:** Dedicated pages (no “single-page tabs” for dashboards)
- **State:** URL-driven filters + lightweight local state

### 2.2 Backend
- **Serverless:** Netlify Functions OR Next.js Route Handlers compatible with Netlify
- **Secrets:** Netlify env vars + `.env.local` only
- **Logging:** structured logs with `request_id` + (if available) `user_id`

### 2.3 Database
- **DB:** Postgres
- **Strategy:** Views-first contracts (widgets read views; forms write tables)
- **Migrations:** SQL migrations applied in order
- **Seeds:** Meaningful sample data for realism + demos

### 2.4 Integrations (Feature-Flagged)
- OpenAI, Census, BLS, Discord, Google Calendar

---

## 3) Naming + Consistency Rules (LOCKED)

### 3.1 System identifiers
- Product name: **CD2_OPS**
- Repo folder suggestion: `cd2_ops`
- Docs title prefix: `CD2_OPS — …`

### 3.2 File naming conventions
- Migrations: `packages/db/migrations/NNN_description.sql`
- Views: `packages/db/views/NNN_views_*.sql`
- Seeds: `packages/db/seeds/NNN_seed_*.sql`
- Modules: `apps/web/src/modules/<module_name>/`
- Prompts: `packages/integrations/openai/prompts/<prompt_name>_vN.md`

### 3.3 DB conventions
- `is_active boolean DEFAULT true`
- `created_at timestamptz DEFAULT now()`
- `updated_at timestamptz DEFAULT now()`
- Views include: `as_of timestamptz` + filterable fields where applicable

---

## 4) Contracts (No Drift Without Logging)

### 4.1 Contract Objects (LOCKED)
These are contracts. Any change requires CONTRACT_CHANGES entry + version bump:
- `packages/core/src/routes.ts`
- `packages/core/src/filters.ts`
- `packages/core/src/metrics.ts`
- `packages/core/src/widgets.ts`
- `packages/db/views/*.sql` (view names + required columns)
- `docs/*` contracts: WIDGET_REGISTRY, METRICS_DICTIONARY, DATA_CONTRACTS, ROUTES

### 4.2 Contract Change Rule (LOCKED)
If you change any of the following, you must:
1) append to `docs/CONTRACT_CHANGES.md`
2) bump version in `docs/VERSION_LOG.md`
3) update docs + tests
4) run snapshot + zip release
Contract changes include:
- widget_id
- view_name or required view columns
- metric_key
- route path
- global filter query params

### 4.3 Widget registry rules (LOCKED)
Required fields for every widget:
- id, pageKey, title, description
- dataSource (view/api)
- filtersSupported
- drilldownRoute (or none)
- metricsUsed
- ownerRole

### 4.4 Widget metadata gate (LOCKED)
Every NEW widget must include:
- `purpose` (why it exists)
- `decisionEnabled` (what decision it changes)
- `definitionNotes` (threshold nuance/caveats)
Enforcement:
- TypeScript required fields in `WidgetDef`
- Merge blocked until metric definitions exist in `docs/METRICS_DICTIONARY.md`

---

## 5) Environment Variables (LOCKED)

### Core
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_NAME=CD2_OPS`
- `NEXT_PUBLIC_ENV=local|staging|prod`

### OpenAI
- `OPENAI_API_KEY`
- `OPENAI_MODEL_PRIMARY`
- `OPENAI_MODEL_FALLBACK`
- `AI_SUGGESTIONS_REQUIRE_APPROVAL=true`

### Census / BLS
- `CENSUS_API_KEY` / `BLS_API_KEY`
- dataset/series defaults

### Discord / Google Calendar
- Discord bot/webhook vars
- Google OAuth vars

### Feature flags (Kill switches)
- `ENABLE_OPENAI`
- `ENABLE_CENSUS`
- `ENABLE_BLS`
- `ENABLE_DISCORD`
- `ENABLE_GCAL`

**Security:** Never commit secrets. Use `.env.example` + `.env.local`.

---

## 6) How We Build (Modular Workflow, LOCKED)

### 6.1 Two-phase method
1) **Module 0 Scaffold:** all routes + registry-driven pages + stubs
2) **Module buildout:** one module at a time, “complete” end-to-end

### 6.2 Definition of Done (per module) (LOCKED)
- UI complete (no placeholders)
- DB/views updated (if needed)
- APIs complete (if needed)
- tests pass (smoke minimum)
- VERSION_LOG appended + BUILD_CHECKLIST updated
- `docs/CONTRACT_CHANGES.md` updated if any contract changed
- snapshot created + zip release created
- no TODOs or commented-out “future logic” shipped
- empty states verified
- drilldowns preserve filters (URL query)

### 6.3 No Inline Logic Rule (LOCKED)
Metric logic never lives in UI components.
Allowed in UI: formatting, sorting, display labels, status coloring from returned fields.
Not allowed in UI: computing rates, thresholds, streaks, or “heating/triggered” logic.

---

## 7) Human Workflow (ChatGPT ↔ Steve ↔ Cursor ↔ GitHub ↔ Netlify)

### 7.1 Standard loop (LOCKED)
1) Steve requests module build
2) ChatGPT returns full paste-ready code + SQL + docs + tests
3) Steve implements in Cursor + runs locally
4) Steve commits + pushes → Netlify deploy preview
5) Steve runs snapshot + creates zip release
6) Steve migrates to new ChatGPT thread using VERSION_LOG + release zip

Commit pattern: `CD2_OPS vX.Y.Z - <module short name>`

### 7.2 Thread migration rule (LOCKED)
When migrating to a new ChatGPT thread, the first message includes:
- latest VERSION_LOG entry
- current BUILD_CHECKLIST completion %
- link/name of latest release zip
- known issues + next module target

---

## 8) Documentation Protocol (LOCKED)
Source docs:
- BUILD_PROTOCOL, BUILD_CHECKLIST, VERSION_LOG
- CONTRACT_CHANGES
- ALERT_CHANNELS
- AI_CHARTER
- MODULE_TEMPLATE

Contract changes require:
- entry in CONTRACT_CHANGES
- version bump
- docs + tests updated

---

## 9) Automation + Integrations Discipline (LOCKED)

### 9.1 Alerts (Discord)
- Alert routing must reference `docs/ALERT_CHANNELS.md`
- No hard-coded channel IDs in code without mapping
- All alerts must include payload fields defined in ALERT_CHANNELS

### 9.2 OpenAI
- Server-side only; no client key exposure
- Prompt files are versioned in repo
- AI writes suggestions only (approval gate)
- All runs logged (ai_runs + ai_suggestions)

### 9.3 Census/BLS
- Never call external APIs on dashboard load
- Use ingestion jobs; store snapshots in Postgres
- Dashboards read Postgres only

### 9.4 Google Calendar
- Sync into `gcal_events`
- Dashboards read from views
- Health signals appear on System Health

---

## 10) Operational Scripts (LOCKED)
Scripts live in `/scripts`:
- `generate-scaffold.mjs` (routes + widget stubs)
- `snapshot.mjs` (contract capture)
- `zip-release.mjs` (release packaging)

**When to run**
- `generate-scaffold`: after any registry/routes update
- `snapshot`: before any module completion commit
- `zip-release`: after module completion merge/push

---
