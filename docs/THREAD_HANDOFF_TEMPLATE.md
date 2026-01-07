# THREAD_HANDOFF_TEMPLATE.md
# CD2_OPS — THREAD HANDOFF TEMPLATE (LOCKED)

Use this template at the **start of every new ChatGPT thread** related to CD2_OPS.

This is the authoritative state handoff.  
No build work begins in a new thread until this is posted.

---

## SYSTEM HEADER (REQUIRED)

**System Name:** CD2_OPS  
**Current Version:** vX.Y.Z-<module-tag>  
**Git Commit (HEAD):** <short-hash>  
**Branch:** main / <branch-name>  
**Netlify Deploy URL:** <preview or prod URL>  
**Release Zip:** CD2_OPS_<version>_<timestamp>.zip  
**Snapshot Folder:** /snapshots/<timestamp>/

---

## BUILD STATE SUMMARY

### Completed Modules
- Module 0 — Scaffold
- Module 1 — DB + Views Skeleton
- Module X — <name>

### In-Progress Module
- Module #:  
- Module Name:  
- Status: (planning / partial / blocked)

### Next Module Target
- Module #:  
- Module Name:  

---

## BUILD CHECKLIST STATUS

**Approximate Completion:** XX%

Key phases:
- Phase 0 (Governance): complete / partial
- Phase 1 (Scaffold): complete / partial
- Phase 2 (DB): complete / partial
- Phase 3+ (Dashboards): in progress

(Reference `docs/BUILD_CHECKLIST.md` for authoritative status.)

---

## CONTRACT STATUS (CRITICAL)

**Any contract changes since last version?**  
- [ ] No  
- [ ] Yes → see `docs/CONTRACT_CHANGES.md`

If yes:
- Last contract change version:
- Date:
- Summary:

---

## KNOWN ISSUES / TECH DEBT

List only real issues (not “future ideas”):
- Issue 1:
- Issue 2:

---

## ASSUMPTIONS / DECISIONS LOCKED

List decisions that should not be revisited casually:
- …
- …

---

## LOCAL DEV NOTES

Anything important for local setup/debug:
- DB notes:
- Netlify quirks:
- Env var notes:

---

## AI / AUTOMATION STATUS

- OpenAI enabled? yes / no
- Census enabled? yes / no
- BLS enabled? yes / no
- Discord enabled? yes / no
- Google Calendar enabled? yes / no

---

## HANDOFF CONFIRMATION

By proceeding, we confirm:
- This handoff accurately reflects repo state
- VERSION_LOG and BUILD_CHECKLIST are up to date
- No uncommitted work exists that affects contracts

**Handoff Date:** YYYY-MM-DD  
**Handoff By:** Steve Grappe
