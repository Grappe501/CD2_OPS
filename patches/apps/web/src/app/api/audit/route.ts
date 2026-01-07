/**
 * PATCH: Audit API supports showDeleted=1.
 * If your repo uses a different route, adapt accordingly.
 */
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { enforceApiAccess, apiError } from "@/lib/apiGuards";

export async function GET(req: Request) {
  try {
    await enforceApiAccess(req, "/api/audit");
    const url = new URL(req.url);
    const showDeleted = (url.searchParams.get("showDeleted") ?? "") === "1";
    const q = (url.searchParams.get("q") ?? "").trim();

    const pool = getPool();

    const res = await pool.query(
      `SELECT audit_id::text AS audit_id,
              occurred_at,
              actor_user_id::text AS actor_user_id,
              actor_name,
              actor_email,
              action,
              entity_type,
              entity_id,
              metadata
       FROM cd2.vw_audit_with_actor
       WHERE ($1 = '' OR actor_name ILIKE '%'||$1||'%' OR actor_email ILIKE '%'||$1||'%' OR entity_type ILIKE '%'||$1||'%')
         AND ($2::boolean = true OR action <> 'soft_delete')
       LIMIT 250`,
      [q, showDeleted]
    );

    return NextResponse.json({ ok: true, rows: res.rows });
  } catch (e: any) {
    return apiError(e);
  }
}
