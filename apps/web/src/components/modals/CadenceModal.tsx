"use client";

import * as React from "react";
import { ModalShell } from "./ModalShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "./useToast";

const windows = [
  { key: "week", label: "Weekly" },
  { key: "two_week", label: "2-Week" },
  { key: "six_week", label: "6-Week" },
  { key: "ninety_day", label: "90-Day" }
] as const;

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function CadenceModal({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [windowKey, setWindowKey] = React.useState<(typeof windows)[number]["key"]>("week");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueAt, setDueAt] = React.useState<string>(() => new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 16));
  const [saving, setSaving] = React.useState(false);

  async function submit() {
    const t = title.trim();
    if (!t) return toast({ title: "Title required", description: "What exactly must happen?" });

    setSaving(true);
    try {
      const res = await fetch("/api/forms/cadence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ window: windowKey, title: t, description, due_at: dueAt })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      toast({ title: "Commitment added", description: "Next: assign an owner + review in weekly rhythm." });
      setTitle("");
      setDescription("");
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Could not save", description: e?.message ?? "Unknown error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Add Cadence Commitment"
      description="Commitments are the weekly/6-week/90-day promises we either keep or we correct."
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">Cadence window</div>
          <div className="flex flex-wrap gap-2">
            {windows.map((w) => (
              <Button key={w.key} variant={w.key === windowKey ? "default" : "secondary"} onClick={() => setWindowKey(w.key)}>
                {w.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium">Title</div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: ‘Publish weekly scorecard by Monday 8am’" />
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium">Due date/time</div>
          <Input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium">Notes (optional)</div>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What ‘done’ means + any constraints" />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
    </ModalShell>
  );
}
