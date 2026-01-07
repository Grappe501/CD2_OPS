"use client";

import * as React from "react";
import { ModalShell } from "./_ModalShell";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast/useToast";
import { undo } from "@/lib/undo";
import { required, collectErrors, firstErrorByField } from "@/lib/validation";

export function NarrativeConfusionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { push } = useToast();
  const [level, setLevel] = React.useState("some");
  const [theme, setTheme] = React.useState("");
  const [county, setCounty] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ field: string; message: string }[]>([]);

  React.useEffect(() => {
    if (!open) { setLevel("some"); setTheme(""); setCounty(""); setNotes(""); setErrors([]); setLoading(false); }
  }, [open]);

  async function submit() {
    const errs = collectErrors([
      required(level, "Pick a level.") && { field: "level", message: required(level, "x")! }
    ]);
    setErrors(errs);
    if (errs.length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/forms/narrative/confusion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, theme: theme || null, county: county || null, notes: notes || null })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Save failed");
      const row = json.row;

      push({
        title: "Confusion captured",
        description: "We’ll correct this quickly.",
        variant: "success",
        actionLabel: "Undo",
        onAction: () => undo("narrative_confusion_signal", row.signal_id)
      });

      onOpenChange(false);
    } catch (e: any) {
      push({ title: "Could not save", description: e.message || "Try again.", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  const lErr = firstErrorByField(errors, "level");

  return (
    <ModalShell open={open} onOpenChange={onOpenChange} title="Add confusion signal">
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">How widespread is the confusion?</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["some","Some"],
              ["a_lot","A lot"],
              ["everywhere","Everywhere"]
            ].map(([k,label]) => (
              <button key={k}
                type="button"
                className={`rounded-xl border border-white/10 p-3 ${level===k ? "bg-white text-black" : "bg-white/5 hover:bg-white/10"}`}
                onClick={() => setLevel(k)}
              >
                {label}
              </button>
            ))}
          </div>
          {lErr ? <div className="text-sm text-rose-300">{lErr}</div> : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <div className="text-sm font-medium">Theme (optional)</div>
            <Input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Social Security / Economy / Voting" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">County (optional)</div>
            <Input value={county} onChange={(e) => setCounty(e.target.value)} placeholder="Pulaski" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium">Notes (optional)</div>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What exactly are people getting wrong?" />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
        </div>
      </div>
    </ModalShell>
  );
}
