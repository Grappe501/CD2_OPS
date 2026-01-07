import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/routeAuth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await requireApiRole(req, ["admin"]);
  const pool = getPool();
  const user_id = params.id;

  const user = await pool.query(
    `SELECT user_id, email, display_name, role, is_active, created_at, updated_at
     FROM cd2.users WHERE user_id=$1`,
    [user_id]
  );

  const ents = await pool.query(
    `SELECT entitlement_id, permission_key, is_granted, notes, created_at, updated_at
     FROM cd2.user_entitlements
     WHERE user_id=$1
     ORDER BY permission_key ASC`,
    [user_id]
  );

  return NextResponse.json({ ok: true, user: user.rows[0] ?? null, entitlements: ents.rows ?? [] });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireApiRole(req, ["admin"]);
  const pool = getPool();
  const user_id = params.id;
  const body = await req.json();

  const fields: string[] = [];
  const vals: any[] = [];
  let i = 1;

  function add(name: string, val: any, include: boolean) {
    if (!include) return;
    fields.push(`${name} = $${i++}`);
    vals.push(val);
  }

  add("display_name", body.display_name ? String(body.display_name) : null, body.display_name !== undefined);
  add("role", body.role ? String(body.role) : null, body.role !== undefined);
  add("is_active", body.is_active !== undefined ? Boolean(body.is_active) : null, body.is_active !== undefined);

  if (fields.length === 0) return NextResponse.json({ ok: false, error: "No fields to update" }, { status: 400 });

  vals.push(user_id);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const upd = await client.query(
      `UPDATE cd2.users SET ${fields.join(", ")}, updated_at=now() WHERE user_id=$${i}
       RETURNING user_id, email, display_name, role, is_active, created_at, updated_at`,
      vals
    );
    const row = upd.rows[0];
    if (!row) throw new Error("User not found");

    // audit action: role_change / user_disable / update
    let action = "user_update";
    if (body.role !== undefined) action = "role_change";
    if (body.is_active === false) action = "user_disable";

    await auditLog(client, {
      actor_user_id: session.sub,
      action,
      entity_type: "user",
      entity_id: user_id,
      metadata: { patch: body },
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
