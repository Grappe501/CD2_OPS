import test from "node:test";
import assert from "node:assert/strict";

import { canAccessPathWithProviders } from "../apps/web/src/lib/access.ts";

const providers = {
  allowedRolesForPath: (pathname) => {
    const map = {
      "/dashboard/audit": ["cm","admin"],
      "/dashboard/finance": ["finance","cm","admin"],
      "/dashboard/data-entry/risks": ["cm","admin","finance","field","comms","data"],
    };
    return map[pathname] ?? null;
  },
  getUserEntitlements: async (user_id) => {
    if (user_id === "u1") return [];
    if (user_id === "u2") return [{ permission_key: "route:/dashboard/audit", is_granted: true }];
    if (user_id === "u3") return [{ permission_key: "route:/dashboard/data-entry/*", is_granted: true }];
    return [];
  },
  hasEntitlement: (ents, key) => {
    // simple wildcard support
    const direct = ents.find(e => e.permission_key === key);
    if (direct) return !!direct.is_granted;
    const wild = ents.find(e => e.permission_key.endsWith("/*") && key.startsWith(e.permission_key.slice(0, -1)));
    return wild ? !!wild.is_granted : false;
  }
};

test("admin always allowed", async () => {
  const r = await canAccessPathWithProviders({ user_id: "u1", role: "admin", pathname: "/dashboard/audit" }, providers);
  assert.equal(r.allowed, true);
});

test("role allowed => allowed", async () => {
  const r = await canAccessPathWithProviders({ user_id: "u1", role: "finance", pathname: "/dashboard/finance" }, providers);
  assert.equal(r.allowed, true);
  assert.equal(r.reason, "role");
});

test("role denied without entitlement => denied", async () => {
  const r = await canAccessPathWithProviders({ user_id: "u1", role: "finance", pathname: "/dashboard/audit" }, providers);
  assert.equal(r.allowed, false);
  assert.equal(r.reason, "denied");
});

test("role denied but entitlement exists => allowed", async () => {
  const r = await canAccessPathWithProviders({ user_id: "u2", role: "finance", pathname: "/dashboard/audit" }, providers);
  assert.equal(r.allowed, true);
  assert.equal(r.reason, "entitlement");
});

test("wildcard entitlement works", async () => {
  const r = await canAccessPathWithProviders({ user_id: "u3", role: "candidate", pathname: "/dashboard/data-entry/risks" }, providers);
  assert.equal(r.allowed, true);
  assert.equal(r.reason, "entitlement");
});
