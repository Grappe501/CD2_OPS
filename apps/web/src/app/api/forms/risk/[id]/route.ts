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

    const risk_id = params.id;

    const owner_role = body.owner_role ? String(body.owner_role) : null;
    const status = body.status ? String(body.status) : null;
    const severity = body.severity !== undefined ? Number(body.severity) : null;
    const last_signal_at = body.last_signal_at ? new Date(String(body.last_signal_at) + "T00:00:00").toISOString() : null;
    const title = body.title ? String(body.title).trim() : null;
    const description = body.description !== undefined ? (body.description ? String(body.description) : null) : undefined;
    const trigger_definition = body.trigger_definition !== undefined ? (body.trigger_definition ? String(body.trigger_definition) : null) : undefined;
    const mitigation_plan = body.mitigation_plan !== undefined ? (body.mitigation_plan ? String(body.mitigation_plan) : null) : undefined;

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
    add("severity", severity, severity !== null);
    add("last_signal_at", last_signal_at, body.last_signal_at !== undefined);
    add("trigger_definition", trigger_definition, trigger_definition !== undefined);
    add("mitigation_plan", mitigation_plan, mitigation_plan !== undefined);

    if (fields.length === 0) {
      return NextResponse.json({ ok: false, error: "No fields to update" }, { status: 400 });
    }

    values.push(risk_id);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const upd = await client.query(
        `UPDATE cd2.risks SET ${fields.join(", ")}, updated_at = now()
         WHERE risk_id = $${i}
         RETURNING risk_id, title, owner_role, status, severity, last_signal_at, created_at, updated_at`,
        values
      );
      const row = upd.rows[0];
      if (!row) throw new Error("Risk not found");

      await auditLog(client, {
        actor_user_id: session.sub,
        action: status === "mitigated" ? "close" : "update",
        entity_type: "risk",
        entity_id: risk_id,
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
