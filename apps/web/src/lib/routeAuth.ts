import { getSessionFromCookies, getSessionFromRequest } from "@/lib/auth";
import type { Role } from "@cd2/core";
import { canAccessPath } from "@/lib/access";

export async function requirePageAccess(pathname: string) {
  const session = await getSessionFromCookies();
  if (!session) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  const res = await canAccessPath({ user_id: session.sub, role: session.role as Role, pathname });
  if (!res.allowed) {
    const err: any = new Error("Forbidden");
    err.status = 403;
    err.reason = res.reason;
    throw err;
  }
  return { session, reason: res.reason };
}

export async function requireApiAccess(req: Request, pathname: string) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  const res = await canAccessPath({ user_id: session.sub, role: session.role as Role, pathname });
  if (!res.allowed) {
    const err: any = new Error("Forbidden");
    err.status = 403;
    err.reason = res.reason;
    throw err;
  }
  return { session, reason: res.reason };
}

/**
 * Backwards compatible helpers (allowed-roles list).
 * These remain for APIs that are not tied to a single route,
 * but prefer requirePageAccess/requireApiAccess for consistency.
 */
export async function requirePageRole(allowed: Role[]) {
  const session = await getSessionFromCookies();
  if (!session) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  if (!allowed.includes(session.role as Role)) {
    const err: any = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
  return session;
}

export async function requireApiRole(req: Request, allowed: Role[]) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  if (!allowed.includes(session.role as Role)) {
    const err: any = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
  return session;
}
