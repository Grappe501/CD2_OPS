/**
 * PATCH: Add these routes to your centralized route map.
 * Exact structure may differ; paste into routes.ts / routeMap.
 */
export const ROUTES_APPEND_MODULE20 = [
  { path: "/onboarding", label: "Onboarding", rolesAllowed: ["admin","staff","volunteer"] },
  { path: "/admin/discord-links", label: "Discord Linking", rolesAllowed: ["admin"] }
];

export const API_ROUTES_APPEND_MODULE20 = [
  "/api/admin/users",
  "/api/admin/discord/links"
];
