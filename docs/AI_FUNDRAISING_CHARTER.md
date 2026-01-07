# CD2_OPS — AI Fundraising Charter (LOCKED)

## Purpose
Use AI to remove friction and increase dollars raised **without** creating compliance or trust risk.

## What AI may do (allowed)
- Pre-call brief: summarize *provided* information into a fast briefing
- Follow-up drafts: produce text/email templates for human review
- Objection handling suggestions (future)
- Pipeline triage suggestions (future)

## What AI may NOT do (disallowed)
- Invent donor details, politics, or personal characteristics
- Infer protected traits or sensitive personal data
- Create canonical metrics (views are truth)
- Auto-send messages without explicit human approval
- Recommend legally risky practices

## Logging (required)
Every AI output must be stored in `cd2.ai_suggestions` with:
- prompt_key + version
- model
- inputs used (json)
- output text
- approval metadata (if required)
- links to the entity (prospect, follow-up, etc.)

## Approval rule
- Pre-call briefs: advisory only, no approval required
- Follow-up drafts: approval required by default
- Approval capability: `ai.approve`

## Safety behavior
If inputs are missing, AI should respond with a request for more info, not hallucinations.

