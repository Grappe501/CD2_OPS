# DEFINITION_OF_DONE.md
# CD2_OPS — DEFINITION OF DONE (LOCKED)

This document defines when work is considered **complete** in CD2_OPS.
If an item below is unchecked, the work is **not done**.

---

## GLOBAL RULE
> “Mostly done” does not exist.  
> If it’s not done, it does not ship.

---

## A) MODULE-LEVEL DONE CHECKLIST

A module is DONE only if **all** of the following are true:

### Architecture & Contracts
- [ ] No new widget IDs without metadata (purpose + decisionEnabled)
- [ ] No contract changes without CONTRACT_CHANGES entry
- [ ] Widget registry compiles
- [ ] Routes map unchanged OR properly logged
- [ ] Metrics used are defined in METRICS_DICTIONARY

### Database
- [ ] All required migrations applied cleanly
- [ ] Views load without SQL errors
- [ ] View outputs validated for basic sanity
- [ ] No metric logic duplicated in UI

### UI / UX
- [ ] All widgets render (no placeholders)
- [ ] Empty states verified and intentional
- [ ] Drilldowns work and preserve URL filters
- [ ] Global filters apply consistently
- [ ] Page usable on smaller viewport (basic mobile pass)

### Functionality
- [ ] Data entry (if applicable) writes correctly
- [ ] API endpoints return expected shape
- [ ] Error states handled gracefully

### Quality
- [ ] No TODO comments in shipped code
- [ ] No commented-out “future” logic
- [ ] No console errors on load
- [ ] Basic smoke test performed

### Documentation
- [ ] VERSION_LOG appended
- [ ] BUILD_CHECKLIST updated
- [ ] Relevant docs updated (routes, widgets, metrics)
- [ ] AI_CHARTER respected (if AI involved)

### Release
- [ ] `scripts/snapshot.mjs` run
- [ ] `scripts/zip-release.mjs <version>` run
- [ ] Commit pushed to GitHub
- [ ] Netlify deploy successful

---

## B) DASHBOARD / WIDGET DONE CHECKLIST

A widget is DONE only if:
- [ ] Purpose is documented
- [ ] Decision it enables is explicit
- [ ] Data source is a view or documented API
- [ ] Tooltip definition exists
- [ ] Owner role is assigned
- [ ] Red/at-risk state explains “what to do next”

---

## C) AI-ASSISTED FEATURE DONE CHECKLIST (IF APPLICABLE)

- [ ] Feature respects AI_CHARTER
- [ ] AI writes suggestions only (no canonical writes)
- [ ] Approval gate enforced
- [ ] ai_runs and ai_suggestions logged
- [ ] Feature degrades gracefully if AI disabled

---

## D) CONTRACT CHANGE DONE CHECKLIST (IF APPLICABLE)

If a contract was changed:
- [ ] CONTRACT_CHANGES entry added
- [ ] Version bump applied
- [ ] Blast radius verified
- [ ] Old references removed
- [ ] Snapshot taken after change

---

## E) FINAL QUESTION (MANDATORY)

Before marking DONE, answer honestly:

> “If I hand this to someone else tomorrow, will they trust it and understand it without asking me questions?”

If the answer is **no**, it is not done.

---
