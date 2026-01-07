import { NextResponse } from "next/server";
import { dbPing, getPool } from "@/lib/db";
import { getAllowedViewNames } from "@/lib/views";

async function checkViewsExist(viewNames: string[]) {
  const pool = getPool();
  const sql = `
    SELECT table_name
    FROM information_schema.views
    WHERE table_schema = 'cd2'
      AND table_name = ANY($1::text[])
  `;
  const res = await pool.query(sql, [viewNames]);
  const found = new Set<string>(res.rows.map((r: any) => r.table_name));
  const missing = viewNames.filter((v) => !found.has(v));
  return { found_count: found.size, missing };
}

export async function GET() {
  const enabled = {
    openai: process.env.ENABLE_OPENAI === "true",
    census: process.env.ENABLE_CENSUS === "true",
    bls: process.env.ENABLE_BLS === "true",
    discord: process.env.ENABLE_DISCORD === "true",
    gcal: process.env.ENABLE_GCAL === "true",
  };

  const hasDbUrl = Boolean(process.env.DATABASE_URL);
  const ping = hasDbUrl ? await dbPing() : { ok: false, error: "DATABASE_URL not set" };

  let viewsOk = false;
  let views = { required: [] as string[], missing: [] as string[], found_count: 0 };

  if (ping.ok) {
    const required = getAllowedViewNames();
    const exists = await checkViewsExist(required);
    views = { required, missing: exists.missing, found_count: exists.found_count };
    viewsOk = exists.missing.length === 0;
  }

  return NextResponse.json({
    ok: Boolean(ping.ok && viewsOk),
    as_of: new Date().toISOString(),
    env: process.env.NEXT_PUBLIC_ENV ?? "unknown",
    enabled,
    db: ping,
    views: { ok: viewsOk, ...views },
    notes: "Module 3 health. Apply Module 1 SQL to DB if views missing.",
  });
}
