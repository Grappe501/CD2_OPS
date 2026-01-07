import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { enforceApiAccess, apiError } from "@/lib/apiGuards";

export async function GET(req: Request) {
  try {
    await enforceApiAccess(req, "/api/admin/discord/links");
    const pool = getPool();

    const res = await pool.query(
      `SELECT l.discord_user_id,
              l.user_id::text AS user_id,
              l.display_name,
              l.is_active,
              l.updated_at,
              u.full_name,
              u.email
       FROM cd2.discord_user_links l
       LEFT JOIN cd2.users u ON u.user_id = l.user_id
       ORDER BY l.updated_at DESC
       LIMIT 200`
    );

    return NextResponse.json({ ok: true, rows: res.rows });
  } catch (e: any) {
    return apiError(e);
  }
}
