import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/routeAuth";

export async function DELETE(req: Request, { params }: { params: { id: string, entitlementId: string } }) {
  const session = await requireApiRole(req, ["admin"]);
  const pool = getPool();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query(
      `SELECT entitlement_id, user_id, permission_key FROM cd2.user_entitlements WHERE entitlement_id=$1`,
      [params.entitlementId]
    );
    const row = existing.rows[0];
    if (!row) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    await client.query(`DELETE FROM cd2.user_entitlements WHERE entitlement_id=$1`, [params.entitlementId]);

    await auditLog(client, {
      actor_user_id: session.sub,
      action: "revoke",
      entity_type: "entitlement",
      entity_id: params.entitlementId,
      metadata: { user_id: row.user_id, permission_key: row.permission_key, deleted: true }
    });

    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    await client.query("ROLLBACK");
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  } finally {
    client.release();
  }
}
