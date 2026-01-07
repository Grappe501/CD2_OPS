/**
 * CD2_OPS — check-parity
 * Blocks merges if generated parity map is out of date.
 *
 * Usage:
 *   node scripts/check-parity.mjs
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const OUT_PATH = path.join(ROOT, "apps/web/src/lib/formApiAccessMap.generated.ts");

function sha(txt) {
  return crypto.createHash("sha256").update(txt).digest("hex");
}

function die(msg) {
  console.error("\n[check:parity] FAIL:", msg);
  process.exit(1);
}

if (!fs.existsSync(OUT_PATH)) {
  die(`Missing generated file: ${OUT_PATH}. Run: node scripts/generate-form-api-access-map.mjs --write`);
}

const committed = fs.readFileSync(OUT_PATH, "utf-8");

let regenerated = "";
try {
  regenerated = execSync("node scripts/generate-form-api-access-map.mjs", { encoding: "utf-8" });
} catch (e) {
  die(`Generator failed. Fix errors, then run --write.`);
}

const c = sha(committed);
const r = sha(regenerated);

if (c !== r) {
  console.error("\n[check:parity] Generated map is stale.");
  console.error(" committed sha:", c);
  console.error(" regen     sha:", r);
  console.error("\nRun:");
  console.error("  node scripts/generate-form-api-access-map.mjs --write");
  console.error("Then commit the regenerated file.");
  process.exit(1);
}

console.log(`[check:parity] OK sha=${c.slice(0,10)}`);
