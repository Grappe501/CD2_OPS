import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/routeAuth";
import { getPool } from "@/lib/db";
import { allowedRolesForPath } from "@/lib/routeMap";
import { getUserEntitlements, hasEntitlement } from "@/lib/entitlements";
import type { Role } from "@cd2/core";

const ROUTES_TO_EVALUATE = [
  "/dashboard/candidate",
  "/dashboard/cm",
  "/dashboard/finance",
  "/dashboard/field",
  "/dashboard/comms",
  "/dashboard/data",
  "/dashboard/data-entry",
  "/dashboard/data-entry/call-time",
  "/dashboard/data-entry/decisions",
  "/dashboard/data-entry/risks",
  "/dashboard/audit",
  "/dashboard/admin/users",
];

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await requireApiRole(req, ["admin"]);
  const user_id = params.id;

  const pool = getPool();
  const u = await pool.query(`SELECT user_id, role FROM cd2.users WHERE user_id=$1 LIMIT 1`, [user_id]);
  const user = u.rows[0];
  if (!user) return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });

  const role = user.role as Role;
  const ents = await getUserEntitlements(user_id);

  const rows = ROUTES_TO_EVALUATE.map((pathname) => {
    if (role === "admin") return { pathname, allowed: true, via: "ROLE(admin)" };

    const allowedRoles = allowedRolesForPath(pathname);
    const roleAllowed = !allowedRoles ? true : allowedRoles.includes(role);

    if (roleAllowed) return { pathname, allowed: true, via: "ROLE" };

    const key = `route:${pathname}`;
    const entAllowed = hasEntitlement(ents, key);
    if (entAllowed) return { pathname, allowed: true, via: "ENTITLEMENT" };

    return { pathname, allowed: false, via: "DENIED" };
  });

  return NextResponse.json({ ok: true, user_id, role, entitlements: ents, rows });
}
