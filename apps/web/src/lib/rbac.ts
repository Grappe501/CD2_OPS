import type { SessionClaims, SessionRole } from "@/lib/auth";

export function requireSession(session: SessionClaims | null): asserts session is SessionClaims {
  if (!session) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
}

export function requireRole(session: SessionClaims | null, allowed: SessionRole[]) {
  requireSession(session);
  if (!allowed.includes(session.role)) {
    const err: any = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}

export function httpErrorToStatus(e: any): number {
  const s = e?.status;
  return Number.isFinite(s) ? s : 500;
}
