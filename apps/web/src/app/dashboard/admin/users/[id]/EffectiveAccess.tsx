"use client";

import { useEffect, useState } from "react";
import { apiJson } from "@/lib/http";

type Row = { pathname: string; allowed: boolean; via: string };

export function EffectiveAccess({ userId }: { userId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    try {
      const data = await apiJson<{ ok: boolean; rows: Row[] }>(`/api/admin/users/${userId}/effective-access`);
      setRows(data.rows ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load effective access.");
    }
  }

  useEffect(() => { refresh().catch(() => {}); }, [userId]);

  return (
    <div className="rounded-xl2 border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Effective Access Simulator</h3>
          <p className="mt-1 text-sm text-white/65">Shows what this user can open, and whether access is via role or entitlement.</p>
        </div>
        <button onClick={() => refresh()} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Refresh</button>
      </div>

      {error ? <div className="mt-3 text-sm text-rose-100">{error}</div> : null}

      <div className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/20">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left px-4 py-3">Route</th>
              <th className="text-left px-4 py-3">Allowed</th>
              <th className="text-left px-4 py-3">Via</th>
              <th className="text-left px-4 py-3">Jump</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.pathname} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-[12px]">{r.pathname}</td>
                <td className="px-4 py-3">{r.allowed ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{r.via}</td>
                <td className="px-4 py-3">
                  <a
                    href={r.pathname}
                    className={`rounded border border-white/10 px-3 py-2 text-sm ${r.allowed ? "bg-white/5 hover:bg-white/10" : "bg-white/5 opacity-40 pointer-events-none"}`}
                  >
                    Open
                  </a>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-white/60">No rows.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
