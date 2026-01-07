import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __cd2_pool: Pool | undefined;
}

export function getPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  if (!global.__cd2_pool) {
    global.__cd2_pool = new Pool({
      connectionString: url,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      ssl: url.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
    });
  }
  return global.__cd2_pool;
}

export async function dbPing(): Promise<{ ok: boolean; error?: string; latency_ms?: number }> {
  const start = Date.now();
  try {
    const pool = getPool();
    await pool.query("SELECT 1 AS ok");
    return { ok: true, latency_ms: Date.now() - start };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Unknown DB error", latency_ms: Date.now() - start };
  }
}
