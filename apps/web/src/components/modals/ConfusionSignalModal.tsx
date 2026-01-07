"use client";

import * as React from "react";
import { ModalShell } from "./ModalShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "./useToast";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

const levels = ["none", "some", "widespread"] as const;

export function ConfusionSignalModal({ open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [level, setLevel] = React.useState<(typeof levels)[number]>("some");
  const [theme, setTheme] = React.useState("");
  const [county, setCounty] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function submit() {
    setSaving(true);
    try {
      const res = await fetch("/api/forms/narrative/confusion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, theme, county, notes })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      toast({ title: "Confusion signal logged", description: "This updates the weekly confusion index." });
      setTheme("");
      setCounty("");
      setNotes("");
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Could not save", description: e?.message ?? "Unknown error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalShell open={open} onOpenChange={onOpenChange} title="Log confusion signal" description="Use this when you feel the message is getting misunderstood or distorted.">
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">Level</div>
          <div className="flex gap-2">
            {levels.map((l) => (
              <Button key={l} variant={l === level ? "default" : "secondary"} onClick={() => setLevel(l)}>
                {l}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="text-sm font-medium">Theme (optional)</div>
            <Input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Example: ‘Medicare cuts rumor’" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">County (optional)</div>
            <Input value={county} onChange={(e) => setCounty(e.target.value)} placeholder="Pulaski" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-medium">Notes (optional)</div>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did people believe / where did it come from?" />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </div>
      </div>
    </ModalShell>
  );
}
