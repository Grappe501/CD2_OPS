import { getPool } from "@/lib/db";

type QueryArgs = any[] | undefined;

async function run<T = any>(text: string, args?: QueryArgs): Promise<T[]> {
  const pool = getPool();
  const res = await pool.query(text, args ?? []);
  return res.rows as T[];
}

export const sql = {
  async any<T = any>(text: string, args?: QueryArgs): Promise<T[]> {
    return run<T>(text, args);
  },

  async one<T = any>(text: string, args?: QueryArgs): Promise<T> {
    const rows = await run<T>(text, args);
    if (rows.length !== 1) throw new Error(`Expected 1 row, got ${rows.length}`);
    return rows[0] as T;
  },

  async maybeOne<T = any>(text: string, args?: QueryArgs): Promise<T | null> {
    const rows = await run<T>(text, args);
    if (rows.length === 0) return null;
    if (rows.length !== 1) throw new Error(`Expected 0 or 1 row, got ${rows.length}`);
    return rows[0] as T;
  },

  async none(text: string, args?: QueryArgs): Promise<void> {
    await run(text, args);
  }
};
