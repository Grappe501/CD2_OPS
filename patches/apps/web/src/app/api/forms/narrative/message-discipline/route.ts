import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { enforceApiAccess, apiError } from "@/lib/apiGuards";
import { resolveActorUserId } from "@/lib/actor";

export async function POST(req: Request) {
  const pool = getPool();
  try {
    await enforceApiAccess(req, "/api/forms/narrative/message-discipline");
    const actor = await resolveActorUserId(req);

    const body = await req.json();
    const status = String(body.status || "").trim();
    if (!status) return NextResponse.json({ ok: false, error: "Status is required" }, { status: 400 });

    const notes = body.notes ? String(body.notes) : null;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const ins = await client.query(
        `INSERT INTO cd2.message_discipline_updates (status, notes, updated_by_user_id)
         VALUES ($1, $2, $3::uuid)
         RETURNING update_id, status, notes, updated_at`,
        [status, notes, actor]
      );
      const row = ins.rows[0];

      await auditLog(client, {
        actor_user_id: actor,
        action: "create",
        entity_type: "message_discipline_update",
        entity_id: row.update_id,
        metadata: { status }
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
