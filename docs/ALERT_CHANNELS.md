# ALERT_CHANNELS.md
# CD2_OPS — ALERT CHANNELS (LOCKED)
Defines where alerts route. Automations must reference this file (no hard-coded channel drift).

## Principles
- Route by type + severity
- Every alert includes owner + escalation + SLA

---

## Default Discord Channel Map (Replace IDs later)
### CM / Ops
- Risk Triggered: #cm-alerts
- Risk Heating: #cm-signals
- Decision Overdue: #cm-alerts
- Cadence Miss (2+): #ops-alerts

### Finance
- Weekly Floor Miss: #finance-alerts
- Runway Below Threshold: #finance-alerts
- Overdue Followups: #finance-work

### Field
- Precinct Lead Coverage Low: #field-alerts
- Ballot Funnel Slippage: #field-alerts
- County Pace Low: #field-work

### Narrative / Comms
- Confusion Widespread: #narrative-alerts
- Top Question Shift: #narrative-signals

### AI Review
- AI Suggestion Ready: #ai-review
- AI Failed/Degraded: #system-health

### System Health
- Integration Down: #system-health
- DB Errors: #system-health

---

## Severity Levels
- INFO: dashboard log only
- AMBER: owner + digest
- RED: owner + CM immediate

---

## Required Alert Payload Fields
- alert_type
- severity
- owner_role
- summary
- link (dashboard URL)
- as_of
- recommended_next_action
