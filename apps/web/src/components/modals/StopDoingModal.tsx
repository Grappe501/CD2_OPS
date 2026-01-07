"use client";

import * as React from "react";
import { ModalShell } from "./_ModalShell";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast/useToast";
import { undo } from "@/lib/undo";
import { required, maxLen, collectErrors, firstErrorByField } from "@/lib/validation";

export function StopDoingModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { push } = useToast();
  const [title, setTitle] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ field: string; message: string }[]>([]);

  React.useEffect(() => {
    if (!open) { setTitle(""); setReason(""); setErrors([]); setLoading(false); }
  }, [open]);

  async function submit() {
    const errs = collectErrors([
      required(title, "Name the thing we should stop doing.") && { field: "title", message: "Name the thing we should stop doing." },
      maxLen(title, 120, "Keep it short.") && { field: "title", message: "Keep it short." }
    ]);
    setErrors(errs);
    if (errs.length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/forms/stop-doing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, reason: reason || null, owner_role: "cm" })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Save failed");
      const row = json.row;

      push({
        title: "Stop-doing added",
        description: "This protects focus.",
        variant: "success",
        actionLabel: "Undo",
        onAction: () => undo("stop_doing_item", row.item_id)
      });

      onOpenChange(false);
    } catch (e: any) {
      push({ title: "Could not save", description: e.message || "Try again.", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  const tErr = firstErrorByField(errors, "title");

  return (
    <ModalShell open={open} onOpenChange={onOpenChange} title="Add stop-doing item">
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">What should we stop doing?</div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: “Chasing low-dollar meetings that don’t convert.”" />
          {tErr ? <div className="text-sm text-rose-300">{tErr}</div> : <div className="text-xs text-white/50">Short and specific is best.</div>}
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium">Why? (optional)</div>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Example: “Takes 4 hours and yields no follow-ups.”" />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
        </div>
      </div>
    </ModalShell>
  );
}
