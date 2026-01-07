import type { Pool } from "pg";
import { getPool } from "@/lib/db";

export type Entitlement = { permission_key: string; is_granted: boolean };

export async function getUserEntitlements(user_id: string): Promise<Entitlement[]> {
  const pool = getPool();
  const res = await pool.query(
    `SELECT permission_key, is_granted
     FROM cd2.user_entitlements
     WHERE user_id = $1`,
    [user_id]
  );
  return res.rows ?? [];
}

/**
 * Permission keys:
 * - route:/dashboard/audit
 * - route:/dashboard/data-entry/*
 */
export function hasEntitlement(entitlements: Entitlement[], permissionKey: string): boolean {
  const direct = entitlements.find(e => e.permission_key === permissionKey);
  if (direct) return !!direct.is_granted;

  // wildcard support: route:/dashboard/data-entry/*
  const parts = permissionKey.split("/");
  for (let i = parts.length; i >= 2; i--) {
    const prefix = parts.slice(0, i).join("/") + "/*";
    const wild = entitlements.find(e => e.permission_key === prefix);
    if (wild) return !!wild.is_granted;
  }
  return false;
}
