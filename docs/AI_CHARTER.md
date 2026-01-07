# AI_CHARTER.md
# CD2_OPS — AI CHARTER (LOCKED)

## Purpose
AI exists to reduce workload, reduce uncertainty, and accelerate drafting.
AI does not exist to make decisions or publish autonomously.

---

## Allowed AI Tasks
1) Weekly Brief Drafting (draft only; CM approves)
2) AskHumans Auto-Tagging (suggestions + confidence; human can override)
3) Donor Note Standardization (structured suggestions; no lane change without approval)
4) Risk Insight Summaries (advisory only)
5) Decision Tool Copilot (draft memo + tradeoff; humans decide)

---

## Disallowed AI Tasks (Hard No)
- publishing externally without human approval
- changing thresholds/floors automatically
- changing canonical metric definitions
- modifying permissions/RBAC
- posting to Discord without explicit configuration and approval safeguards

---

## Guardrails (Non-negotiable)
1) Server-side only (no OpenAI key in client)
2) Audit logging every run
3) Suggestions-only writes (ai_suggestions)
4) Approval gate required for canonical changes
5) Prompt versioning in repo (`prompts/*_vN.md`)
6) PII discipline (minimize; use IDs)

---

## Required DB Logging (Minimum)
- ai_runs: run_id, ts, user_id, prompt_version, model, input_hash, output_hash, status, latency_ms
- ai_suggestions: suggestion_id, run_id, entity_type, entity_id, changes_json, confidence, status, reviewer_user_id

---

## Failure Behavior
- Dashboards still work if AI disabled/degraded
- AI widgets show disabled/degraded state
- System Health reports last success and error

---
