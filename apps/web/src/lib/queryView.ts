import { getPool } from "@/lib/db";

const ident = (s: string) => `"${s.replace(/"/g, '""')}"`;

export async function queryView(opts: { viewName: string; schema?: string; limit?: number }) {
  const schema = opts.schema ?? "cd2";
  const limit = Math.max(1, Math.min(opts.limit ?? 500, 2000));
  const sql = `SELECT * FROM ${ident(schema)}.${ident(opts.viewName)} LIMIT $1`;
  const pool = getPool();
  const result = await pool.query(sql, [limit]);
  return { rows: result.rows };
}
