import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { requireApiAccess } from "@/lib/routeAuth";
import { httpErrorToStatus } from "@/lib/rbac";

export async function GET(req: Request) {
  try {
    // server-runtime enforcement for audit route
    await requireApiAccess(req, "/dashboard/audit");

    const { searchParams } = new URL(req.url);
    const entity_type = searchParams.get("entity_type");
    const action = searchParams.get("action");
    const q = searchParams.get("q");
    const hours = Number(searchParams.get("hours") ?? "168");
    const limit = Math.max(1, Math.min(Number(searchParams.get("limit") ?? "200"), 500));

    const where = [];
    const vals: any[] = [];
    let i = 1;

    if (entity_type) { where.push(`a.entity_type = $${i++}`); vals.push(entity_type); }
    if (action) { where.push(`a.action = $${i++}`); vals.push(action); }
    if (Number.isFinite(hours) && hours > 0) { where.push(`a.created_at >= now() - ($${i++}::text)::interval`); vals.push(`${hours} hours`); }

    if (q) {
      where.push(`(
        a.entity_id::text ILIKE $${i} OR
        a.metadata_json::text ILIKE $${i}
      )`);
      vals.push(`%${q}%`);
      i++;
    }

    const pool = getPool();
    const sql = `
      SELECT
        a.audit_id,
        a.actor_user_id,
        u.display_name AS actor_name,
        u.role AS actor_role,
        u.email AS actor_email,
        a.action,
        a.entity_type,
        a.entity_id,
        a.created_at,
        a.metadata_json
      FROM cd2.audit_log a
      LEFT JOIN cd2.users u ON u.user_id = a.actor_user_id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY a.created_at DESC
      LIMIT ${limit}
    `;
    const res = await pool.query(sql, vals);
    return NextResponse.json({ ok: true, rows: res.rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Error" }, { status: httpErrorToStatus(e) });
  }
}
