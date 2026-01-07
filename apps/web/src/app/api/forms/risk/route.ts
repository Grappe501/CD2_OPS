import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth";
import { requireSession, httpErrorToStatus } from "@/lib/rbac";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  try {
    requireSession(session);
    const pool = getPool();
    const res = await pool.query(
      `SELECT risk_id, title, owner_role, status, severity, last_signal_at, created_at, updated_at
       FROM cd2.risks
       ORDER BY created_at DESC
       LIMIT 25`
    );
    return NextResponse.json({ ok: true, rows: res.rows });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Error" }, { status: httpErrorToStatus(e) });
  }
}

export async function POST(req: Request) {
  const session = await getSessionFromRequest(req);
  try {
    requireSession(session);
    const pool = getPool();
    const body = await req.json();

    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });

    const description = body.description ? String(body.description) : null;
    const owner_role = String(body.owner_role || "cm");
    const status = String(body.status || "stable");
    const severity = Number(body.severity ?? 3);
    const trigger_definition = body.trigger_definition ? String(body.trigger_definition) : null;
    const mitigation_plan = body.mitigation_plan ? String(body.mitigation_plan) : null;
    const last_signal_at = body.last_signal_at ? new Date(String(body.last_signal_at) + "T00:00:00").toISOString() : null;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const ins = await client.query(
        `INSERT INTO cd2.risks (title, description, owner_role, status, severity, trigger_definition, mitigation_plan, last_signal_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING risk_id, title, owner_role, status, severity, last_signal_at, created_at, updated_at`,
        [title, description, owner_role, status, severity, trigger_definition, mitigation_plan, last_signal_at]
      );

      const row = ins.rows[0];

      await auditLog(client, {
        actor_user_id: session.sub,
        action: "create",
        entity_type: "risk",
        entity_id: row.risk_id,
        metadata: { title, owner_role, status, severity, last_signal_at }
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
