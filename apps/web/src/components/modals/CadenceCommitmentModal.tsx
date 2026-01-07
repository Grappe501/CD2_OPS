"use client";

import * as React from "react";
import { ModalShell } from "./_ModalShell";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast/useToast";
import { undo } from "@/lib/undo";
import { required, collectErrors, firstErrorByField } from "@/lib/validation";

export function CadenceCommitmentModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { push } = useToast();
  const [window, setWindow] = React.useState("week");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [dueAt, setDueAt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ field: string; message: string }[]>([]);

  React.useEffect(() => {
    if (!open) { setWindow("week"); setTitle(""); setDescription(""); setDueAt(""); setErrors([]); setLoading(false); }
  }, [open]);

  async function submit() {
    const errs = collectErrors([
      required(title, "Name the commitment.") && { field: "title", message: "Name the commitment." }
    ]);
    setErrors(errs);
    if (errs.length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/forms/cadence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ window, title, description: description || null, owner_role: "cm", due_at: dueAt || null })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Save failed");
      const row = json.row;

      push({
        title: "Commitment created",
        description: "Due dates prevent surprises.",
        variant: "success",
        actionLabel: "Undo",
        onAction: () => undo("cadence_commitment", row.commitment_id)
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
    <ModalShell open={open} onOpenChange={onOpenChange} title="Add cadence commitment">
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">Window</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["2weeks","2 weeks"],
              ["6weeks","6 weeks"],
              ["90days","90 days"]
            ].map(([k,label]) => (
              <button key={k} type="button"
                className={`rounded-xl border border-white/10 p-3 ${window===k ? "bg-white text-black" : "bg-white/5 hover:bg-white/10"}`}
                onClick={() => setWindow(k)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium">Commitment</div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: “Book 3 house parties in Jacksonville.”" />
          {tErr ? <div className="text-sm text-rose-300">{tErr}</div> : null}
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium">Description (optional)</div>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does ‘done’ look like?" />
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium">Due date (optional)</div>
          <Input value={dueAt} onChange={(e) => setDueAt(e.target.value)} placeholder="YYYY-MM-DD or leave blank" />
          <div className="text-xs text-white/50">If blank, the system will set a default.</div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
        </div>
      </div>
    </ModalShell>
  );
}
