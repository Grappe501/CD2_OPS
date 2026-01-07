import { requireApiAccess } from "@/lib/routeAuth";
import { httpErrorToStatus } from "@/lib/rbac";
import { NextResponse } from "next/server";

export async function enforceApiAccess(req: Request, pathname: string) {
  // uses Module 10 server-runtime access logic (role + entitlements)
  return await requireApiAccess(req, pathname);
}

export function apiError(e: any) {
  return NextResponse.json(
    { ok: false, error: e?.message ?? "Error", reason: e?.reason ?? undefined },
    { status: httpErrorToStatus(e) }
  );
}
