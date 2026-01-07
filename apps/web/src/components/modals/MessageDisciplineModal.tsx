"use client";

import * as React from "react";
import { ModalShell } from "./ModalShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "./useToast";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function MessageDisciplineModal({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [status, setStatus] = React.useState("holding");
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function submit() {
    const s = status.trim();
    if (!s) return toast({ title: "Status required", description: "Example: holding | slipping | broken" });

    setSaving(true);
    try {
      const res = await fetch("/api/forms/narrative/message-discipline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: s, notes })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      toast({ title: "Message discipline updated", description: "This sets the dashboard status immediately." });
      setNotes("");
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Could not save", description: e?.message ?? "Unknown error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalShell open={open} onOpenChange={onOpenChange} title="Update message discipline" description="Comms lead checkpoint: are we holding the narrative or drifting?">
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">Status</div>
          <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="holding | slipping | broken" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium">Notes (optional)</div>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What’s slipping + what needs to change" />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
    </ModalShell>
  );
}
