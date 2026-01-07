import type { Role } from "@cd2/core";
import { allowedRolesForPath } from "@/lib/routeMap";
import { getUserEntitlements, hasEntitlement, type Entitlement } from "@/lib/entitlements";

export async function canAccessPath(args: {
  user_id: string;
  role: Role;
  pathname: string;
}): Promise<{ allowed: boolean; reason: "role" | "entitlement" | "denied" }> {
  return canAccessPathWithProviders(args, {
    allowedRolesForPath,
    getUserEntitlements,
    hasEntitlement,
  });
}

/**
 * Injectable variant for deterministic tests.
 */
export async function canAccessPathWithProviders(
  args: { user_id: string; role: Role; pathname: string },
  providers: {
    allowedRolesForPath: (pathname: string) => Role[] | null;
    getUserEntitlements: (user_id: string) => Promise<Entitlement[]>;
    hasEntitlement: (ents: Entitlement[], key: string) => boolean;
  }
): Promise<{ allowed: boolean; reason: "role" | "entitlement" | "denied" }> {
  const { user_id, role, pathname } = args;

  if (role === "admin") return { allowed: true, reason: "role" };

  const allowedRoles = providers.allowedRolesForPath(pathname);
  if (!allowedRoles) return { allowed: true, reason: "role" };
  if (allowedRoles.includes(role)) return { allowed: true, reason: "role" };

  const ents = await providers.getUserEntitlements(user_id);
  const key = `route:${pathname}`;
  if (providers.hasEntitlement(ents, key)) return { allowed: true, reason: "entitlement" };

  return { allowed: false, reason: "denied" };
}
