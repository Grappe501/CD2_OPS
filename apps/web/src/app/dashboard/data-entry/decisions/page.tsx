"use client";

import { FormCard } from "@/components/forms/FormCard";
import { InputField, SelectField, TextAreaField } from "@/components/forms/Inputs";
import { SubmitBar } from "@/components/forms/SubmitBar";
import { apiJson } from "@/lib/http";
import { useEffect, useMemo, useState } from "react";

type DecisionRow = {
  decision_id: string;
  title: string;
  description: string | null;
  owner_role: string;
  status: string;
  priority: number;
  due_at: string | null;
  requested_at: string;
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
  const [recent, setRecent] = useState<DecisionRow[]>([]);
  const [selected, setSelected] = useState<DecisionRow | null>(null);

  async function refresh() {
    const data = await apiJson<{ ok: boolean; rows: DecisionRow[] }>("/api/forms/decision");
    setRecent(data.rows ?? []);
  }

  useEffect(() => { refresh().catch(() => {}); }, []);

  const selId = selected?.decision_id;

  return (
    <div className="space-y-6">
      <FormCard
        title="Decision Intake"
        description="Capture decisions early so they do not become silent bottlenecks."
      >
        <form id="decisionForm" className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <InputField label="Title" name="title" placeholder="What needs to be decided?" required />
          </div>

          <div className="col-span-12 md:col-span-6">
            <SelectField label="Owner role" name="owner_role" required options={ROLE_OPTS} defaultValue="cm" />
          </div>

          <div className="col-span-12 md:col-span-3">
            <SelectField
              label="Priority"
              name="priority"
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

          <div className="col-span-12 md:col-span-3">
            <InputField label="Due date (optional)" name="due_at" type="date" />
          </div>

          <div className="col-span-12">
            <TextAreaField label="Description (context, constraints, options)" name="description" />
          </div>

          <div className="col-span-12">
            <SubmitBar
              submitLabel="Create decision"
              onSubmit={async () => {
                const form = document.getElementById("decisionForm") as HTMLFormElement;
                const payload = Object.fromEntries(new FormData(form).entries());
                await apiJson("/api/forms/decision", { method: "POST", body: JSON.stringify(payload) });
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
            <h3 className="text-lg font-semibold">Recent decisions</h3>
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
                  <th className="text-left px-4 py-3">Priority</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Due</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr
                    key={r.decision_id}
                    onClick={() => setSelected(r)}
                    className={`border-t border-white/10 hover:bg-white/5 cursor-pointer ${selId === r.decision_id ? "bg-white/5" : ""}`}
                  >
                    <td className="px-4 py-3 min-w-[360px]">{r.title}</td>
                    <td className="px-4 py-3">{r.owner_role}</td>
                    <td className="px-4 py-3">{r.priority}</td>
                    <td className="px-4 py-3">{r.status}</td>
                    <td className="px-4 py-3">{r.due_at ? r.due_at.slice(0, 10) : "—"}</td>
                  </tr>
                ))}
                {recent.length === 0 ? (
                  <tr><td className="px-4 py-6 text-white/60" colSpan={5}>No decisions yet.</td></tr>
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
              Select a decision from the list to edit.
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="text-xs text-white/55">Decision ID</div>
              <div className="font-mono text-[11px] text-white/75">{selected.decision_id}</div>

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
                  {["open","blocked","in_review","closed"].map(s => <option key={s} value={s} className="bg-[#0b1120]">{s}</option>)}
                </select>
              </label>

              <label className="block">
                <div className="text-xs text-white/60">Priority</div>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  value={selected.priority}
                  onChange={(e) => setSelected({ ...selected, priority: Number(e.target.value) })}
                />
              </label>

              <label className="block">
                <div className="text-xs text-white/60">Due date</div>
                <input
                  type="date"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  value={selected.due_at ? selected.due_at.slice(0,10) : ""}
                  onChange={(e) => setSelected({ ...selected, due_at: e.target.value ? (e.target.value + "T00:00:00.000Z") : null })}
                />
              </label>

              <label className="block">
                <div className="text-xs text-white/60">Description</div>
                <textarea
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  value={selected.description ?? ""}
                  onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                />
              </label>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  className="rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 px-4 py-2 text-sm"
                  onClick={async () => {
                    await apiJson(`/api/forms/decision/${selected.decision_id}`, {
                      method: "PATCH",
                      body: JSON.stringify({
                        title: selected.title,
                        description: selected.description,
                        owner_role: selected.owner_role,
                        status: selected.status,
                        priority: selected.priority,
                        due_at: selected.due_at ? selected.due_at.slice(0,10) : null,
                      }),
                    });
                    await refresh();
                  }}
                >
                  Save changes
                </button>

                <button
                  className="rounded-lg border border-rose-300/20 bg-rose-300/10 hover:bg-rose-300/15 px-4 py-2 text-sm text-rose-100"
                  onClick={async () => {
                    await apiJson(`/api/forms/decision/${selected.decision_id}`, {
                      method: "PATCH",
                      body: JSON.stringify({ status: "closed" }),
                    });
                    await refresh();
                  }}
                >
                  Close decision
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
