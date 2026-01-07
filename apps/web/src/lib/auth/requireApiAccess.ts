/**
 * NOTE: This file is here as a compatibility shim. If your repo already defines requireApiAccess,
 * remove this file and import the existing one.
 */
import { NextRequest } from "next/server";

export async function requireApiAccess(_req: NextRequest, _capability: string) {
  // In your actual repo, enforce entitlements + return actor_user_id.
  // This shim assumes you already have server-runtime enforcement elsewhere.
  return { actor_user_id: null as any, request_id: crypto.randomUUID() };
}
