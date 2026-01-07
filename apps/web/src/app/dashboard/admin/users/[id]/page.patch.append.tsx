/**
 * PATCH INSTRUCTIONS:
 * In your existing `apps/web/src/app/dashboard/admin/users/[id]/page.tsx`,
 * add:
 *
 * import { EffectiveAccess } from "./EffectiveAccess";
 *
 * Then, near the bottom (after Entitlements section), render:
 *   <EffectiveAccess userId={userId} />
 *
 * This file is not meant to be compiled; it’s a patch guide.
 */
export {};
