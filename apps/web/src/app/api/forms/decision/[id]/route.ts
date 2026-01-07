import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth";
import { requireRole, httpErrorToStatus } from "@/lib/rbac";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSessionFromRequest(req);
  try {
    requireRole(session, ["cm", "admin"]);
    const pool = getPool();
    const body = await req.json();

    const decision_id = params.id;
    const title = body.title ? String(body.title).trim() : null;
    const description = body.description !== undefined ? (body.description ? String(body.description) : null) : undefined;
    const owner_role = body.owner_role ? String(body.owner_role) : null;
    const status = body.status ? String(body.status) : null;
    const priority = body.priority !== undefined ? Number(body.priority) : null;
    const due_at = body.due_at ? new Date(String(body.due_at) + "T00:00:00").toISOString() : null;

    const fields = [];
    const values = [];
    let i = 1;

    function add(name: string, val: any, include: boolean) {
      if (!include) return;
      fields.push(`${name} = $${i++}`);
      values.push(val);
    }

    add("title", title, title !== null);
    add("description", description, description !== undefined);
    add("owner_role", owner_role, owner_role !== null);
    add("status", status, status !== null);
    add("priority", priority, priority !== null);
    add("due_at", due_at, body.due_at !== undefined);

    if (fields.length === 0) {
      return NextResponse.json({ ok: false, error: "No fields to update" }, { status: 400 });
    }

    values.push(decision_id);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const upd = await client.query(
        `UPDATE cd2.decisions SET ${fields.join(", ")}, updated_at = now()
         WHERE decision_id = $${i}
         RETURNING decision_id, title, description, owner_role, status, priority, due_at, requested_at, created_at, updated_at`,
        values
      );
      const row = upd.rows[0];
      if (!row) throw new Error("Decision not found");

      await auditLog(client, {
        actor_user_id: session.sub,
        action: status === "closed" ? "close" : "update",
        entity_type: "decision",
        entity_id: decision_id,
        metadata: { patch: body }
      });

      await client.query("COMMIT");
      return NextResponse.json({ ok: true, row });
    } catch (e: any) {
      await client.query("ROLLBACK");
      return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Error" }, { status: httpErrorToStatus(e) });
  }
}
