import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { enforceApiAccess, apiError } from "@/lib/apiGuards";
import { resolveActorUserId } from "@/lib/actor";

export async function POST(req: Request) {
  const pool = getPool();
  try {
    await enforceApiAccess(req, "/api/forms/stop-doing");
    const actor = await resolveActorUserId(req);

    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });

    const reason = body.reason ? String(body.reason) : null;
    const owner_role = String(body.owner_role || "cm");

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const ins = await client.query(
        `INSERT INTO cd2.stop_doing_items (title, reason, owner_role)
         VALUES ($1, $2, $3)
         RETURNING item_id, title, reason, owner_role, status, created_at`,
        [title, reason, owner_role]
      );
      const row = ins.rows[0];

      await auditLog(client, {
        actor_user_id: actor,
        action: "create",
        entity_type: "stop_doing_item",
        entity_id: row.item_id,
        metadata: { title, owner_role }
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
