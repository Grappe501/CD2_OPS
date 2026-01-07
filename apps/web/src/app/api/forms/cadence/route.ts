import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { enforceApiAccess, apiError } from "@/lib/apiGuards";

export async function GET(req: Request) {
  try {
    await enforceApiAccess(req, "/api/forms/cadence");
    const pool = getPool();
    const res = await pool.query(
      `SELECT commitment_id, window, title, owner_role, status, due_at, created_at
       FROM cd2.cadence_commitments
       WHERE is_active = true
       ORDER BY due_at ASC
       LIMIT 100`
    );
    return NextResponse.json({ ok: true, rows: res.rows });
  } catch (e: any) {
    return apiError(e);
  }
}

export async function POST(req: Request) {
  const pool = getPool();
  try {
    await enforceApiAccess(req, "/api/forms/cadence");
    const body = await req.json();
    const window = String(body.window || "week");
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });

    const description = body.description ? String(body.description) : null;
    const owner_role = String(body.owner_role || "cm");
    const due_at = body.due_at ? new Date(String(body.due_at)).toISOString() : new Date(Date.now() + 3 * 86400 * 1000).toISOString();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const ins = await client.query(
        `INSERT INTO cd2.cadence_commitments (window, title, description, owner_role, due_at)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING commitment_id, window, title, owner_role, status, due_at, created_at`,
        [window, title, description, owner_role, due_at]
      );
      const row = ins.rows[0];

      await auditLog(client, {
        actor_user_id: null,
        action: "create",
        entity_type: "cadence_commitment",
        entity_id: row.commitment_id,
        metadata: { window, title, owner_role, due_at }
      });

      await client.query("COMMIT");
      return NextResponse.json({ ok: true, row });
    } catch (e: any) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (e: any) {
    return apiError(e);
  }
}
