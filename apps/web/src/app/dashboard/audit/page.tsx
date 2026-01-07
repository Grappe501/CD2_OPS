"use client";

import { useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/http";

type AuditRow = {
  audit_id: string;
  actor_user_id: string | null;
  actor_name: string | null;
  actor_role: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
  metadata_json: any;
};

type Filters = {
  entity_type: string;
  action: string;
  q: string;
  hours: string;
  limit: string;
};

const ENTITY_TYPES = ["", "call_time_log", "decision", "risk", "user", "entitlement"];
const ACTIONS = ["", "create", "update", "close", "grant", "revoke", "role_change", "user_create", "user_disable", "password_reset", "user_update"];

export default function Page() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<Filters>({ entity_type: "", action: "", q: "", hours: "168", limit: "200" });
  const [error, setError] = useState<string | null>(null);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.entity_type) p.set("entity_type", filters.entity_type);
    if (filters.action) p.set("action", filters.action);
    if (filters.q) p.set("q", filters.q);
    if (filters.hours) p.set("hours", filters.hours);
    if (filters.limit) p.set("limit", filters.limit);
    return p.toString();
  }, [filters]);

  async function refresh() {
    setError(null);
    try {
      const data = await apiJson<{ ok: boolean; rows: AuditRow[] }>(`/api/forms/audit?${qs}`);
      setRows(data.rows ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load audit.");
    }
  }

  useEffect(() => { refresh().catch(() => {}); }, [qs]);

  const actorLabel = (r: AuditRow) => {
    if (r.actor_name) return `${r.actor_name} · ${r.actor_role ?? "—"}`;
    if (r.actor_user_id) return r.actor_user_id;
    return "—";
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl2 border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)]">
        <div className="text-xs uppercase tracking-[0.24em] text-white/60">Ops</div>
        <h1 className="mt-1 text-2xl font-semibold">Audit Explorer</h1>
        <p className="mt-2 text-sm text-white/65">
          System-of-record for who changed what, when. Includes permission changes.
        </p>

        <div className="mt-5 grid grid-cols-12 gap-3">
          <label className="col-span-12 md:col-span-3">
            <div className="text-xs text-white/55">Entity type</div>
            <select
              value={filters.entity_type}
              onChange={(e) => setFilters({ ...filters, entity_type: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            >
              {ENTITY_TYPES.map(v => <option key={v} value={v} className="bg-[#0b1120]">{v || "All"}</option>)}
            </select>
          </label>

          <label className="col-span-12 md:col-span-3">
            <div className="text-xs text-white/55">Action</div>
            <select
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            >
              {ACTIONS.map(v => <option key={v} value={v} className="bg-[#0b1120]">{v || "All"}</option>)}
            </select>
          </label>

          <label className="col-span-12 md:col-span-3">
            <div className="text-xs text-white/55">Time window (hours)</div>
            <input
              value={filters.hours}
              onChange={(e) => setFilters({ ...filters, hours: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder="168"
            />
          </label>

          <label className="col-span-12 md:col-span-3">
            <div className="text-xs text-white/55">Limit</div>
            <input
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder="200"
            />
          </label>

          <label className="col-span-12">
            <div className="text-xs text-white/55">Search (entity_id or metadata)</div>
            <input
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder='e.g. "route:/dashboard/audit" or a UUID'
            />
          </label>

          <div className="col-span-12 flex items-center gap-3">
            <button
              onClick={() => refresh()}
              className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            >
              Refresh
            </button>
            <button
              onClick={() => setFilters({ entity_type: "", action: "", q: "", hours: "168", limit: "200" })}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Reset
            </button>
            {error ? <div className="text-sm text-rose-100">{error}</div> : null}
          </div>
        </div>
      </section>

      <section className="rounded-xl2 border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Events</h3>
          <div className="text-xs text-white/55">{rows.length} rows</div>
        </div>

        <div className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/20">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3">Time</th>
                <th className="text-left px-4 py-3">Actor</th>
                <th className="text-left px-4 py-3">Action</th>
                <th className="text-left px-4 py-3">Entity</th>
                <th className="text-left px-4 py-3">Entity ID</th>
                <th className="text-left px-4 py-3">Meta</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isOpen = Boolean(expanded[r.audit_id]);
                return (
                  <>
                    <tr key={r.audit_id} className="border-t border-white/10 hover:bg-white/5">
                      <td className="px-4 py-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="leading-tight">
                          <div className="text-white/85">{actorLabel(r)}</div>
                          {r.actor_email ? <div className="text-[11px] text-white/45">{r.actor_email}</div> : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">{r.action}</td>
                      <td className="px-4 py-3">{r.entity_type}</td>
                      <td className="px-4 py-3">
                        {r.entity_id ? (
                          <div className="flex items-center gap-2">
                            <button
                              className="font-mono text-[11px] text-white/80 hover:text-white underline underline-offset-4"
                              onClick={() => setFilters({ ...filters, q: r.entity_id ?? "" })}
                            >
                              {r.entity_id}
                            </button>
                            <button
                              className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] hover:bg-white/10"
                              onClick={async () => { await navigator.clipboard.writeText(r.entity_id ?? ""); }}
                            >
                              Copy
                            </button>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] hover:bg-white/10"
                          onClick={() => setExpanded({ ...expanded, [r.audit_id]: !isOpen })}
                        >
                          {isOpen ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr className="border-t border-white/10 bg-black/30">
                        <td colSpan={6} className="px-4 py-4">
                          <pre className="max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/20 p-3 text-[11px] text-white/75">
                            {JSON.stringify(r.metadata_json ?? {}, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    ) : null}
                  </>
                );
              })}
              {rows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-white/60">No audit events match current filters.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
