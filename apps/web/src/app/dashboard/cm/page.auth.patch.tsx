/**
 * OPTIONAL PATCH EXAMPLE (do not copy as-is unless you want per-page hard guards):
 *
 * import { redirect } from "next/navigation";
 * import { requirePageRole } from "@/lib/routeAuth";
 *
 * export default async function Page() {
 *   try { await requirePageRole(["cm","admin"]); }
 *   catch { redirect("/dashboard/unauthorized?from=/dashboard/cm"); }
 *   return (...existing page...);
 * }
 */
export {};
