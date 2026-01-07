/**
 * CD2_OPS — check-api-guards
 * Scans Next route handlers under apps/web/src/app/api/forms/**/route.ts
 * and reports missing access guard usage.
 *
 * Usage:
 *   node scripts/check-api-guards.mjs
 *
 * Exit code 1 if any missing.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FORMS_DIR = path.join(ROOT, "apps/web/src/app/api/forms");

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

if (!fs.existsSync(FORMS_DIR)) {
  console.log(`[check-api-guards] forms dir not found: ${FORMS_DIR}`);
  process.exit(0);
}

const files = walk(FORMS_DIR).filter(f => f.endsWith("route.ts") || f.endsWith("route.tsx"));
const missing = [];

for (const f of files) {
  const txt = fs.readFileSync(f, "utf-8");
  const hasGuard = txt.includes("enforceApiAccess(") || txt.includes("requireApiAccess(");
  if (!hasGuard) missing.push(path.relative(ROOT, f));
}

if (missing.length) {
  console.error("\n[check-api-guards] Missing API access guard in:");
  for (const m of missing) console.error(" -", m);
  console.error("\nFix by adding: await enforceApiAccess(req, '<dashboard route>');");
  process.exit(1);
}

console.log(`[check-api-guards] OK — ${files.length} form routes checked; all guarded.`);
