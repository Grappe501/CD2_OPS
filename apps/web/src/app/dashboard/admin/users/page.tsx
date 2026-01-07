"use client";

import { useEffect, useState } from "react";
import { apiJson } from "@/lib/http";

type UserRow = {
  user_id: string;
  email: string;
  display_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

export default function Page() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({ email: "", display_name: "", role: "cm" });

  async function refresh() {
    setError(null);
    try {
      const data = await apiJson<{ ok: boolean; rows: UserRow[] }>("/api/admin/users");
      setRows(data.rows ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load users.");
    }
  }

  useEffect(() => { refresh().catch(() => {}); }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-xl2 border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)]">
        <div className="text-xs uppercase tracking-[0.24em] text-white/60">Admin</div>
        <h1 className="mt-1 text-2xl font-semibold">User Directory</h1>
        <p className="mt-2 text-sm text-white/65">Create users, assign roles, and manage access.</p>

        <div className="mt-5 grid grid-cols-12 gap-3">
          <label className="col-span-12 md:col-span-4">
            <div className="text-xs text-white/55">Email</div>
            <input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder="name@campaign.org" />
          </label>
          <label className="col-span-12 md:col-span-4">
            <div className="text-xs text-white/55">Display name</div>
            <input value={newUser.display_name} onChange={e => setNewUser({ ...newUser, display_name: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Full Name" />
          </label>
          <label className="col-span-12 md:col-span-2">
            <div className="text-xs text-white/55">Role</div>
            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20">
              {["candidate","cm","finance","field","comms","data","admin"].map(r => <option key={r} value={r} className="bg-[#0b1120]">{r}</option>)}
            </select>
          </label>
          <div className="col-span-12 md:col-span-2 flex items-end">
            <button
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
              onClick={async () => {
                await apiJson("/api/admin/users", { method: "POST", body: JSON.stringify(newUser) });
                setNewUser({ email: "", display_name: "", role: "cm" });
                await refresh();
              }}
            >
              Create
            </button>
          </div>
        </div>

        {error ? <div className="mt-3 text-sm text-rose-100">{error}</div> : null}
      </section>

      <section className="rounded-xl2 border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Users</h3>
          <button onClick={() => refresh()} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Refresh</button>
        </div>

        <div className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/20">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Active</th>
                <th className="text-left px-4 py-3">Created</th>
                <th className="text-left px-4 py-3">Manage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(u => (
                <tr key={u.user_id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3">{u.display_name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">{u.is_active ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <a className="rounded border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10" href={`/dashboard/admin/users/${u.user_id}`}>Open</a>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-white/60">No users.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
