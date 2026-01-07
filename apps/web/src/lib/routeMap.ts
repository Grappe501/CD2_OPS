import type { Role } from "@cd2/core";

export const DASHBOARD_ROUTE_ROLES: Record<string, Role[]> = {
  "/dashboard/candidate": ["candidate","cm","admin"],
  "/dashboard/cm": ["cm","admin"],
  "/dashboard/finance": ["finance","cm","admin"],
  "/dashboard/field": ["field","cm","admin"],
  "/dashboard/comms": ["comms","cm","admin"],
  "/dashboard/data": ["data","cm","admin"],

  "/dashboard/data-entry": ["candidate","cm","finance","field","comms","data","admin"],
  "/dashboard/data-entry/call-time": ["candidate","cm","finance","admin"],
  "/dashboard/data-entry/decisions": ["candidate","cm","admin"],
  "/dashboard/data-entry/risks": ["cm","admin","finance","field","comms","data"],

  "/dashboard/audit": ["cm","admin"],

  "/dashboard/admin/users": ["admin"],
  "/dashboard/admin/users/": ["admin"],

  "/dashboard/unauthorized": ["candidate","cm","finance","field","comms","data","admin"],
};

export function allowedRolesForPath(pathname: string): Role[] | null {
  if (DASHBOARD_ROUTE_ROLES[pathname]) return DASHBOARD_ROUTE_ROLES[pathname];
  const keys = Object.keys(DASHBOARD_ROUTE_ROLES).filter(k => k.endsWith("/"));
  for (const k of keys) {
    if (pathname.startsWith(k)) return DASHBOARD_ROUTE_ROLES[k];
  }
  return null;
}
