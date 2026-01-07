"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast/useToast";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prospectId?: string | null;
  defaultSessionId?: string | null;
  displayName?: string | null;
};

const OUTCOMES = [
  { key: "talked", label: "Talked" },
  { key: "left_vm", label: "Left voicemail" },
  { key: "no_answer", label: "No answer" },
  { key: "scheduled_callback", label: "Scheduled callback" },
  { key: "refused", label: "Refused" },
  { key: "wrong_number", label: "Wrong number" },
  { key: "bad_number", label: "Bad number" },
] as const;

export function FrLogCallModal({ open, onOpenChange, prospectId, defaultSessionId, displayName }: Props) {
  const { toast } = useToast();
  const [outcome, setOutcome] = React.useState<string>("talked");
  const [duration, setDuration] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setOutcome("talked");
    setDuration("");
    setNotes("");
  }, [open]);

  async function submit() {
    if (!prospectId) {
      toast({ title: "Missing prospect", description: "Close and re-open from a prospect row." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/forms/fundraising/log-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: defaultSessionId,
          prospect_id: prospectId,
          outcome,
          duration_seconds: duration ? Number(duration) : null,
          notes: notes || null,
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Failed to save");
      toast({ title: "Saved", description: "Call logged." });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Could not save", description: e?.message || "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Log call</DialogTitle>
          <DialogDescription>
            {displayName ? `Prospect: ${displayName}` : "Save the outcome. Add notes if helpful."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Outcome</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {OUTCOMES.map(o => (
                <Button
                  key={o.key}
                  type="button"
                  variant={outcome === o.key ? "default" : "secondary"}
                  onClick={() => setOutcome(o.key)}
                >
                  {o.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Talk time (seconds)</Label>
            <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 180" />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did they say? Any commitments?" />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button onClick={submit} disabled={loading}>{loading ? "Saving…" : "Save call"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
