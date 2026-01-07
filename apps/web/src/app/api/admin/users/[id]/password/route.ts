import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/routeAuth";
import bcrypt from "bcryptjs";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await requireApiRole(req, ["admin"]);
  const pool = getPool();
  const user_id = params.id;
  const body = await req.json();

  const password = String(body.password || "");
  if (password.length < 8) {
    return NextResponse.json({ ok: false, error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO cd2.user_credentials (user_id, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now()`,
      [user_id, hash]
    );

    await auditLog(client, {
      actor_user_id: session.sub,
      action: "password_reset",
      entity_type: "user",
      entity_id: user_id,
      metadata: { method: "admin_set" }
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
