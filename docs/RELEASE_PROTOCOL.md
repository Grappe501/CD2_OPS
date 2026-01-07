# RELEASE_PROTOCOL.md
# CD2_OPS — RELEASE PROTOCOL (LOCKED)
This protocol defines exactly how we package, deploy, archive, and migrate development across ChatGPT threads without losing state.

**Owner:** Steve Grappe  
**Deployment:** GitHub → Netlify  
**Release Artifact:** versioned zip file

---

## 1) Release Units (What counts as a release)
A “release” happens when a module is completed and merged.

A module is not releasable until:
- it meets Definition of Done in `docs/BUILD_PROTOCOL.md`
- `docs/VERSION_LOG.md` is appended
- `docs/BUILD_CHECKLIST.md` is updated
- contract changes (if any) are appended in `docs/CONTRACT_CHANGES.md`
- snapshot is created
- zip is created

---

## 2) Versioning Rules
We use semantic-ish versions, tuned for module delivery:

- `v0.0.1` … `v0.0.x` for governance/scaffold
- `v0.1.0` for Module 0 (Scaffold)
- then increment per completed module

Recommended convention:
- `vX.Y.Z-<module-tag>`
Examples:
- `v0.0.1-phase0`
- `v0.1.0-module0-scaffold`
- `v0.2.0-module1-db`
- `v0.3.0-module2-cockpit`

**Rule:** every entry in VERSION_LOG must include the exact version string used for zip packaging.

---

## 3) Commit Discipline (LOCKED)
Preferred:
- One commit per module completion
- Commit message pattern:
  - `CD2_OPS vX.Y.Z - <module short name>`

If multiple commits are required during development:
- squash before merge OR ensure the final merge commit clearly matches version.

---

## 4) Deployment Discipline (Netlify)
- Deploy previews must be enabled
- Staging environment optional (recommended)
- Production deploy from `main` only
- Secrets stored only in Netlify environment variables
- Never store secrets in repo

---

## 5) Mandatory Scripts Per Release
Before final commit:
1) `node scripts/snapshot.mjs`
   - creates `/snapshots/<timestamp>/` with contract copies

After final commit and push:
2) `node scripts/zip-release.mjs <version>`
   - creates `/releases/CD2_OPS_<version>_<timestamp>.zip`

Optional:
3) `node scripts/generate-scaffold.mjs`
   - run when route/widget registry changes

---

## 6) Release Artifact Structure
Each release generates:
- a Netlify deploy preview (or prod deploy)
- a snapshot folder in `/snapshots/`
- a zip file in `/releases/`

Zip naming:
- `CD2_OPS_<version>_<timestamp>.zip`

Example:
- `CD2_OPS_v0.1.0-module0-scaffold_2026-01-05T18-42-10-123Z.zip`

---

## 7) Thread Migration Protocol (LOCKED)
When we migrate to a new ChatGPT thread, the first message must include:

### 7.1 Required header block
- System: CD2_OPS
- Current Version: vX.Y.Z-<module-tag>
- Git Commit: <short-hash>
- Netlify Deploy URL: <preview/prod url>
- Release Zip: <filename>
- Snapshot: <timestamp folder>

### 7.2 Required state block
- BUILD_CHECKLIST completion % (rough but explicit)
- Completed modules list
- Current in-progress module (if any)
- Known issues / tech debt
- Next module target

### 7.3 Required “contracts” block
- Confirm whether any contract changed since last version:
  - yes/no
- If yes: cite CONTRACT_CHANGES entry date + version

---

## 8) Rollback Procedure
If a release breaks:
1) revert to the last known-good commit
2) deploy from that commit
3) use the latest snapshot folder to restore contracts if needed
4) create a VERSION_LOG entry documenting rollback rationale

---

## 9) Operational Advantage Rule
We do not ship half-modules.
If a module is incomplete, it stays on a branch and does not get a version bump.

---
