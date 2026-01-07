"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast/useToast";

type Row = {
  prospect_id: string;
  display_name: string;
  phone: string | null;
  lane_name: string | null;
  ask_amount_suggested: number | null;
  next_action_at: string | null;
  next_action_note: string | null;
};

export function CallSheet() {
  const { toast } = useToast();
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/fundraising/callsheet");
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Failed");
      setRows(j.rows || []);
    } catch (e: any) {
      toast({ title: "Could not load call sheet", description: e?.message || "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  function print() {
    window.print();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div className="text-sm opacity-70">Tip: Use your browser’s Print → “Save as PDF”.</div>
        <div className="flex gap-2">
          <Button className="btn-elder" variant="secondary" onClick={load} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
          <Button className="btn-elder" onClick={print}>Print / Save PDF</Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm table-elder">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Lane</th>
              <th className="text-right p-3">Ask</th>
              <th className="text-left p-3">Next action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.prospect_id} className="border-t">
                <td className="p-3 font-medium">{r.display_name}</td>
                <td className="p-3">{r.phone || "—"}</td>
                <td className="p-3">{r.lane_name || "—"}</td>
                <td className="p-3 text-right">{r.ask_amount_suggested ? `$${Number(r.ask_amount_suggested).toLocaleString()}` : "—"}</td>
                <td className="p-3">
                  <div className="opacity-80">{r.next_action_at ? new Date(r.next_action_at).toLocaleString() : "—"}</div>
                  {r.next_action_note ? <div className="text-xs opacity-70">{r.next_action_note}</div> : null}
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr><td className="p-4 opacity-70" colSpan={5}>No rows (yet).</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
