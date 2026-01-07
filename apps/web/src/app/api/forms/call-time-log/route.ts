import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { getSessionFromRequest } from "@/lib/auth";
import { requireSession, httpErrorToStatus } from "@/lib/rbac";

export async function GET(req: Request) {
  // Auth enforced by middleware, but keep safe for direct calls
  const session = await getSessionFromRequest(req);
  try {
    requireSession(session);
    const pool = getPool();
    const res = await pool.query(
      `SELECT call_log_id, call_date, lane, calls_made, connects, dollars_raised, notes, created_at
       FROM cd2.call_time_logs
       ORDER BY call_date DESC, created_at DESC
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

    const call_date = body.call_date || null;
    const lane = String(body.lane || "general");
    const calls_made = Number(body.calls_made ?? 0);
    const connects = Number(body.connects ?? 0);
    const dollars_raised = Number(body.dollars_raised ?? 0);
    const notes = body.notes ? String(body.notes) : null;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const ins = await client.query(
        `INSERT INTO cd2.call_time_logs (call_date, lane, calls_made, connects, dollars_raised, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING call_log_id, call_date, lane, calls_made, connects, dollars_raised, notes, created_at`,
        [call_date, lane, calls_made, connects, dollars_raised, notes]
      );

      const row = ins.rows[0];

      await auditLog(client, {
        actor_user_id: session.sub,
        action: "create",
        entity_type: "call_time_log",
        entity_id: row.call_log_id,
        metadata: { lane, call_date, calls_made, connects, dollars_raised }
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
