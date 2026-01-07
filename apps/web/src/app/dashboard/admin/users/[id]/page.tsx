"use client";

import { useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/http";

type User = {
  user_id: string;
  email: string;
  display_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type Ent = {
  entitlement_id: string;
  permission_key: string;
  is_granted: boolean;
  notes: string | null;
  created_at: string;
};

export default function Page({ params }: { params: { id: string } }) {
  const userId = params.id;
  const [user, setUser] = useState<User | null>(null);
  const [ents, setEnts] = useState<Ent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [edit, setEdit] = useState({ display_name: "", role: "cm", is_active: true });
  const [pwd, setPwd] = useState("");

  const [entForm, setEntForm] = useState({ permission_key: "route:/dashboard/audit", is_granted: true, notes: "" });

  async function refresh() {
    setError(null);
    try {
      const data = await apiJson<{ ok: boolean; user: User; entitlements: Ent[] }>(`/api/admin/users/${userId}`);
      setUser(data.user);
      setEnts(data.entitlements ?? []);
      setEdit({
        display_name: data.user.display_name,
        role: data.user.role,
        is_active: data.user.is_active,
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to load.");
    }
  }

  useEffect(() => { refresh().catch(() => {}); }, [userId]);

  const suggestions = useMemo(() => ([
    "route:/dashboard/audit",
    "route:/dashboard/finance",
    "route:/dashboard/field",
    "route:/dashboard/data-entry/*",
    "route:/dashboard/data-entry/decisions",
  ]), []);

  return (
    <div className="space-y-6">
      <section className="rounded-xl2 border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)]">
        <div className="text-xs uppercase tracking-[0.24em] text-white/60">Admin</div>
        <h1 className="mt-1 text-2xl font-semibold">User</h1>
        {user ? (
          <p className="mt-2 text-sm text-white/65">{user.display_name} · {user.email}</p>
        ) : (
          <p className="mt-2 text-sm text-white/65">Loading…</p>
        )}
        {error ? <div className="mt-3 text-sm text-rose-100">{error}</div> : null}
      </section>

      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-6 rounded-xl2 border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">Profile</h3>
          <div className="mt-4 space-y-4">
            <label className="block">
              <div className="text-xs text-white/55">Display name</div>
              <input value={edit.display_name} onChange={e => setEdit({ ...edit, display_name: e.target.value })}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20" />
            </label>

            <label className="block">
              <div className="text-xs text-white/55">Role</div>
              <select value={edit.role} onChange={e => setEdit({ ...edit, role: e.target.value })}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20">
                {["candidate","cm","finance","field","comms","data","admin"].map(r => <option key={r} value={r} className="bg-[#0b1120]">{r}</option>)}
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={edit.is_active} onChange={e => setEdit({ ...edit, is_active: e.target.checked })} />
              Active
            </label>

            <div className="flex gap-3">
              <button className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
                onClick={async () => {
                  await apiJson(`/api/admin/users/${userId}`, { method: "PATCH", body: JSON.stringify(edit) });
                  await refresh();
                }}>
                Save
              </button>
              <a href="/dashboard/admin/users" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">Back</a>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-6 rounded-xl2 border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">Reset password</h3>
          <p className="mt-2 text-sm text-white/65">Sets bcrypt hash in `cd2.user_credentials`. Audit logged.</p>
          <div className="mt-4 space-y-4">
            <label className="block">
              <div className="text-xs text-white/55">New password (min 8 chars)</div>
              <input type="password" value={pwd} onChange={e => setPwd(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20" />
            </label>
            <button className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
              onClick={async () => {
                await apiJson(`/api/admin/users/${userId}/password`, { method: "POST", body: JSON.stringify({ password: pwd }) });
                setPwd("");
              }}>
              Set password
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl2 border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold">Entitlements</h3>
        <p className="mt-2 text-sm text-white/65">
          Fine-grained overrides. Use keys like <span className="font-mono text-[12px]">route:/dashboard/audit</span> or wildcard
          <span className="font-mono text-[12px]"> route:/dashboard/data-entry/*</span>.
        </p>

        <div className="mt-4 grid grid-cols-12 gap-3">
          <label className="col-span-12 md:col-span-6">
            <div className="text-xs text-white/55">Permission key</div>
            <input value={entForm.permission_key} onChange={e => setEntForm({ ...entForm, permission_key: e.target.value })}
              list="permkeys"
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20" />
            <datalist id="permkeys">
              {suggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          </label>
          <label className="col-span-12 md:col-span-2">
            <div className="text-xs text-white/55">Grant?</div>
            <select value={String(entForm.is_granted)} onChange={e => setEntForm({ ...entForm, is_granted: e.target.value === "true" })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20">
              <option value="true" className="bg-[#0b1120]">Grant</option>
              <option value="false" className="bg-[#0b1120]">Revoke</option>
            </select>
          </label>
          <label className="col-span-12 md:col-span-4">
            <div className="text-xs text-white/55">Notes (optional)</div>
            <input value={entForm.notes} onChange={e => setEntForm({ ...entForm, notes: e.target.value })}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20" />
          </label>

          <div className="col-span-12 flex gap-3">
            <button className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
              onClick={async () => {
                await apiJson(`/api/admin/users/${userId}/entitlements`, { method: "POST", body: JSON.stringify(entForm) });
                setEntForm({ permission_key: entForm.permission_key, is_granted: true, notes: "" });
                await refresh();
              }}>
              Apply entitlement
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-auto rounded-xl border border-white/10 bg-black/20">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3">Permission</th>
                <th className="text-left px-4 py-3">Granted</th>
                <th className="text-left px-4 py-3">Notes</th>
                <th className="text-left px-4 py-3">Created</th>
                <th className="text-left px-4 py-3">Remove</th>
              </tr>
            </thead>
            <tbody>
              {ents.map(e => (
                <tr key={e.entitlement_id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-[12px]">{e.permission_key}</td>
                  <td className="px-4 py-3">{e.is_granted ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-white/60">{e.notes ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button className="rounded border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                      onClick={async () => {
                        await apiJson(`/api/admin/users/${userId}/entitlements/${e.entitlement_id}`, { method: "DELETE" });
                        await refresh();
                      }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {ents.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-white/60">No entitlements.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
