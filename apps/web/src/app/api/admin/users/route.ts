import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { enforceApiAccess, apiError } from "@/lib/apiGuards";

export async function GET(req: Request) {
  try {
    await enforceApiAccess(req, "/api/admin/users");
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const pool = getPool();

    const res = await pool.query(
      `SELECT user_id::text AS user_id,
              email,
              full_name,
              role::text AS role
       FROM cd2.users
       WHERE ($1 = '' OR email ILIKE '%'||$1||'%' OR full_name ILIKE '%'||$1||'%')
       ORDER BY full_name NULLS LAST
       LIMIT 25`,
      [q]
    );

    return NextResponse.json({ ok: true, rows: res.rows });
  } catch (e: any) {
    return apiError(e);
  }
}
