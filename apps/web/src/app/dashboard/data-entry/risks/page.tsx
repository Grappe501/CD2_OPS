"use client";

import { FormCard } from "@/components/forms/FormCard";
import { InputField, SelectField, TextAreaField } from "@/components/forms/Inputs";
import { SubmitBar } from "@/components/forms/SubmitBar";
import { apiJson } from "@/lib/http";
import { useEffect, useState } from "react";

type RiskRow = {
  risk_id: string;
  title: string;
  owner_role: string;
  status: string;
  severity: number;
  last_signal_at: string | null;
  trigger_definition?: string | null;
  mitigation_plan?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

const ROLE_OPTS = [
  { value: "cm", label: "CM" },
  { value: "candidate", label: "Candidate" },
  { value: "finance", label: "Finance" },
  { value: "field", label: "Field" },
  { value: "comms", label: "Comms" },
  { value: "data", label: "Data" },
  { value: "admin", label: "Admin" },
];

export default function Page() {
  const [recent, setRecent] = useState<RiskRow[]>([]);
  const [selected, setSelected] = useState<RiskRow | null>(null);

  async function refresh() {
    const data = await apiJson<{ ok: boolean; rows: RiskRow[] }>("/api/forms/risk");
    setRecent(data.rows ?? []);
  }

  useEffect(() => { refresh().catch(() => {}); }, []);

  const selId = selected?.risk_id;

  return (
    <div className="space-y-6">
      <FormCard
        title="Risk Register Intake"
        description="Log risks with a trigger definition and mitigation plan so early warning signals are visible."
      >
        <form id="riskForm" className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <InputField label="Risk title" name="title" placeholder="What could break our plan?" required />
          </div>

          <div className="col-span-12 md:col-span-6">
            <SelectField label="Owner role" name="owner_role" required options={ROLE_OPTS} defaultValue="cm" />
          </div>

          <div className="col-span-12 md:col-span-3">
            <SelectField
              label="Status"
              name="status"
              required
              options={[
                { value: "stable", label: "Stable" },
                { value: "watch", label: "Watch" },
                { value: "triggered", label: "Triggered" },
                { value: "mitigated", label: "Mitigated" },
              ]}
              defaultValue="stable"
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <SelectField
              label="Severity"
              name="severity"
              required
              options={[
                { value: "1", label: "1 (High)" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "5", label: "5 (Low)" },
              ]}
              defaultValue="3"
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <InputField label="Last signal date (optional)" name="last_signal_at" type="date" />
          </div>

          <div className="col-span-12">
            <TextAreaField label="Trigger definition" name="trigger_definition" placeholder="What tells us this risk is materializing?" />
          </div>
          <div className="col-span-12">
            <TextAreaField label="Mitigation plan" name="mitigation_plan" placeholder="What do we do if this triggers?" />
          </div>
          <div className="col-span-12">
            <TextAreaField label="Description (optional)" name="description" placeholder="Context, history, supporting notes." />
          </div>

          <div className="col-span-12">
            <SubmitBar
              submitLabel="Create risk"
              onSubmit={async () => {
                const form = document.getElementById("riskForm") as HTMLFormElement;
                const payload = Object.fromEntries(new FormData(form).entries());
                await apiJson("/api/forms/risk", { method: "POST", body: JSON.stringify(payload) });
                await refresh();
                form.reset();
              }}
            />
          </div>
        </form>
      </FormCard>

      <section className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7 rounded-xl2 border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent risks</h3>
            <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10" onClick={() => refresh()}>
              Refresh
            </button>
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/20">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Owner</th>
                  <th className="text-left px-4 py-3">Severity</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Last signal</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr
                    key={r.risk_id}
                    onClick={() => setSelected(r)}
                    className={`border-t border-white/10 hover:bg-white/5 cursor-pointer ${selId === r.risk_id ? "bg-white/5" : ""}`}
                  >
                    <td className="px-4 py-3 min-w-[360px]">{r.title}</td>
                    <td className="px-4 py-3">{r.owner_role}</td>
                    <td className="px-4 py-3">{r.severity}</td>
                    <td className="px-4 py-3">{r.status}</td>
                    <td className="px-4 py-3">{r.last_signal_at ? r.last_signal_at.slice(0,10) : "—"}</td>
                  </tr>
                ))}
                {recent.length === 0 ? (
                  <tr><td className="px-4 py-6 text-white/60" colSpan={5}>No risks yet.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5 rounded-xl2 border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">Edit / Close</h3>
          <p className="mt-2 text-sm text-white/65">Only CM/Admin can edit. Updates are audit-logged.</p>

          {!selected ? (
            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-6 text-sm text-white/65">
              Select a risk from the list to edit.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="text-xs text-white/55">Risk ID</div>
              <div className="font-mono text-[11px] text-white/75">{selected.risk_id}</div>

              <label className="block">
                <div className="text-xs text-white/60">Title</div>
                <input
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  value={selected.title}
                  onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                />
              </label>

              <label className="block">
                <div className="text-xs text-white/60">Owner</div>
                <select
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  value={selected.owner_role}
                  onChange={(e) => setSelected({ ...selected, owner_role: e.target.value })}
                >
                  {ROLE_OPTS.map(o => <option key={o.value} value={o.value} className="bg-[#0b1120]">{o.label}</option>)}
                </select>
              </label>

              <label className="block">
                <div className="text-xs text-white/60">Status</div>
                <select
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  value={selected.status}
                  onChange={(e) => setSelected({ ...selected, status: e.target.value })}
                >
                  {["stable","watch","triggered","mitigated"].map(s => <option key={s} value={s} className="bg-[#0b1120]">{s}</option>)}
                </select>
              </label>

              <label className="block">
                <div className="text-xs text-white/60">Severity</div>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  value={selected.severity}
                  onChange={(e) => setSelected({ ...selected, severity: Number(e.target.value) })}
                />
              </label>

              <label className="block">
                <div className="text-xs text-white/60">Last signal</div>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  value={selected.last_signal_at ? selected.last_signal_at.slice(0,10) : ""}
                  onChange={(e) => setSelected({ ...selected, last_signal_at: e.target.value ? (e.target.value + "T00:00:00.000Z") : null })}
                />
              </label>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  className="rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 px-4 py-2 text-sm"
                  onClick={async () => {
                    await apiJson(`/api/forms/risk/${selected.risk_id}`, {
                      method: "PATCH",
                      body: JSON.stringify({
                        title: selected.title,
                        owner_role: selected.owner_role,
                        status: selected.status,
                        severity: selected.severity,
                        last_signal_at: selected.last_signal_at ? selected.last_signal_at.slice(0,10) : null,
                      }),
                    });
                    await refresh();
                  }}
                >
                  Save changes
                </button>

                <button
                  className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 hover:bg-emerald-300/15 px-4 py-2 text-sm text-emerald-100"
                  onClick={async () => {
                    await apiJson(`/api/forms/risk/${selected.risk_id}`, {
                      method: "PATCH",
                      body: JSON.stringify({ status: "mitigated" }),
                    });
                    await refresh();
                  }}
                >
                  Mark mitigated
                </button>

                <button
                  className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm"
                  onClick={() => setSelected(null)}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
