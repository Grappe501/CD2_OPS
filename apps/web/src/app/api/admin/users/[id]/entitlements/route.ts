import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/routeAuth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await requireApiRole(req, ["admin"]);
  const pool = getPool();
  const user_id = params.id;
  const body = await req.json();

  const permission_key = String(body.permission_key || "").trim();
  const is_granted = body.is_granted === undefined ? true : Boolean(body.is_granted);
  const notes = body.notes ? String(body.notes) : null;

  if (!permission_key) return NextResponse.json({ ok: false, error: "permission_key required" }, { status: 400 });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const up = await client.query(
      `INSERT INTO cd2.user_entitlements (user_id, permission_key, is_granted, notes)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, permission_key)
       DO UPDATE SET is_granted = EXCLUDED.is_granted, notes = EXCLUDED.notes, updated_at = now()
       RETURNING entitlement_id, user_id, permission_key, is_granted, notes, created_at, updated_at`,
      [user_id, permission_key, is_granted, notes]
    );

    const row = up.rows[0];

    await auditLog(client, {
      actor_user_id: session.sub,
      action: is_granted ? "grant" : "revoke",
      entity_type: "entitlement",
      entity_id: row.entitlement_id,
      metadata: { user_id, permission_key, is_granted, notes }
    });

    await client.query("COMMIT");
    return NextResponse.json({ ok: true, row });
  } catch (e: any) {
    await client.query("ROLLBACK");
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  } finally {
    client.release();
  }
}
