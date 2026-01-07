"use client";

import { FormCard } from "@/components/forms/FormCard";
import { InputField, SelectField, TextAreaField } from "@/components/forms/Inputs";
import { SubmitBar } from "@/components/forms/SubmitBar";
import { apiJson } from "@/lib/http";
import { useEffect, useState } from "react";

type CallTimeRow = {
  call_log_id: string;
  call_date: string;
  lane: string;
  calls_made: number;
  connects: number;
  dollars_raised: string;
  notes: string | null;
  created_at: string;
};

export default function Page() {
  const [recent, setRecent] = useState<CallTimeRow[]>([]);

  async function refresh() {
    const data = await apiJson<{ ok: boolean; rows: CallTimeRow[] }>("/api/forms/call-time-log");
    setRecent(data.rows ?? []);
  }

  useEffect(() => { refresh().catch(() => {}); }, []);

  return (
    <div className="space-y-6">
      <FormCard
        title="Call Time Log"
        description="Enter daily call time totals. This powers pacing, floors, and finance discipline."
      >
        <form id="callTimeForm" className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <InputField label="Call date" name="call_date" type="date" required />
          </div>
          <div className="col-span-12 md:col-span-4">
            <SelectField
              label="Lane"
              name="lane"
              required
              options={[
                { value: "general", label: "General" },
                { value: "major", label: "Major donors" },
                { value: "events", label: "Events" },
                { value: "followup", label: "Follow-up" },
              ]}
              defaultValue="general"
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <InputField label="Dollars raised" name="dollars_raised" type="number" placeholder="0" required />
          </div>

          <div className="col-span-12 md:col-span-4">
            <InputField label="Calls made" name="calls_made" type="number" placeholder="0" required />
          </div>
          <div className="col-span-12 md:col-span-4">
            <InputField label="Connects" name="connects" type="number" placeholder="0" required />
          </div>
          <div className="col-span-12 md:col-span-4">
            <InputField label="Notes (optional tag)" name="notes" placeholder="e.g., 'new bundler intro'" />
          </div>

          <div className="col-span-12">
            <SubmitBar
              submitLabel="Save call log"
              onSubmit={async () => {
                const form = document.getElementById("callTimeForm") as HTMLFormElement;
                const fd = new FormData(form);
                const payload = Object.fromEntries(fd.entries());
                await apiJson("/api/forms/call-time-log", { method: "POST", body: JSON.stringify(payload) });
                await refresh();
                form.reset();
              }}
            />
          </div>
        </form>
      </FormCard>

      <section className="rounded-xl2 border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent logs</h3>
          <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10" onClick={() => refresh()}>
            Refresh
          </button>
        </div>
        <div className="mt-4 overflow-auto rounded-xl border border-white/10 bg-black/20">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Lane</th>
                <th className="text-left px-4 py-3">Calls</th>
                <th className="text-left px-4 py-3">Connects</th>
                <th className="text-left px-4 py-3">Raised</th>
                <th className="text-left px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.call_log_id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3">{r.call_date}</td>
                  <td className="px-4 py-3">{r.lane}</td>
                  <td className="px-4 py-3">{r.calls_made}</td>
                  <td className="px-4 py-3">{r.connects}</td>
                  <td className="px-4 py-3">${Number(r.dollars_raised).toFixed(0)}</td>
                  <td className="px-4 py-3 text-white/60">{r.notes ?? "—"}</td>
                </tr>
              ))}
              {recent.length === 0 ? (
                <tr><td className="px-4 py-6 text-white/60" colSpan={6}>No logs yet.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
