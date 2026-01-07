import { NextResponse } from "next/server";
import { setSessionCookie, type SessionRole } from "@/lib/auth";
import { getPool } from "@/lib/db";
import bcrypt from "bcryptjs";

function passwordForRole(role: SessionRole): string | null {
  const byRole: Record<SessionRole, string | undefined> = {
    admin: process.env.AUTH_ADMIN_PASSWORD,
    cm: process.env.AUTH_CM_PASSWORD,
    finance: process.env.AUTH_FINANCE_PASSWORD,
    field: process.env.AUTH_FIELD_PASSWORD,
    comms: process.env.AUTH_COMMS_PASSWORD,
    data: process.env.AUTH_DATA_PASSWORD,
    candidate: process.env.AUTH_CANDIDATE_PASSWORD,
  };
  return byRole[role] ?? process.env.AUTH_DEFAULT_PASSWORD ?? null;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  // Preferred: email+password login
  if (body.email) {
    const email = String(body.email).trim().toLowerCase();
    const password = String(body.password || "");

    const pool = getPool();

    const userRes = await pool.query(
      `SELECT user_id, display_name, role, is_active FROM cd2.users WHERE email=$1 LIMIT 1`,
      [email]
    );
    const user = userRes.rows[0];
    if (!user || !user.is_active) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const credRes = await pool.query(
      `SELECT password_hash FROM cd2.user_credentials WHERE user_id=$1`,
      [user.user_id]
    );
    const cred = credRes.rows[0];
    if (!cred) return NextResponse.json({ ok: false, error: "No password set for this user" }, { status: 401 });

    const ok = await bcrypt.compare(password, cred.password_hash);
    if (!ok) return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });

    await setSessionCookie({ sub: user.user_id, role: user.role, name: user.display_name });
    return NextResponse.json({ ok: true, role: user.role, name: user.display_name });
  }

  // Legacy fallback: role+password (fast ops)
  const role = String(body.role ?? "cm") as SessionRole;
  const password = String(body.password ?? "");
  const expected = passwordForRole(role);
  if (!expected) return NextResponse.json({ ok: false, error: "Auth not configured" }, { status: 500 });
  if (password !== expected) return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });

  // Create or fetch role user for stable sub
  const pool = getPool();
  const email = `${role}@cd2_ops.local`;
  const res = await pool.query(`SELECT user_id, display_name FROM cd2.users WHERE email=$1 LIMIT 1`, [email]);
  let user = res.rows[0];
  if (!user) {
    const ins = await pool.query(
      `INSERT INTO cd2.users (email, display_name, role) VALUES ($1, $2, $3) RETURNING user_id, display_name`,
      [email, role.toUpperCase(), role]
    );
    user = ins.rows[0];
  }

  await setSessionCookie({ sub: user.user_id, role, name: user.display_name });
  return NextResponse.json({ ok: true, role, name: user.display_name });
}
