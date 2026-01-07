"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/toast/useToast";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prospectId?: string | null;
  relatedAttemptId?: string | null;
  relatedPledgeId?: string | null;
  displayName?: string | null;
};

export function FrAddFollowupModal({ open, onOpenChange, prospectId, relatedAttemptId, relatedPledgeId, displayName }: Props) {
  const { toast } = useToast();
  const [title, setTitle] = React.useState("");
  const [dueAt, setDueAt] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setTitle("Send donation link + thank you");
    setDueAt("");
    setDetails("");
  }, [open]);

  async function submit() {
    if (!prospectId) return toast({ title: "Missing prospect", description: "Open from a prospect." });
    if (!title) return toast({ title: "Title required", description: "What needs to happen?" });

    setLoading(true);
    try {
      const res = await fetch("/api/forms/fundraising/log-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect_id: prospectId,
          related_attempt_id: relatedAttemptId,
          related_pledge_id: relatedPledgeId,
          title,
          details: details || null,
          due_at: dueAt || null
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Failed to save");
      toast({ title: "Follow-up created", description: "It will show up in Follow-ups." });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Could not save follow-up", description: e?.message || "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add follow-up</DialogTitle>
          <DialogDescription>
            {displayName ? `Prospect: ${displayName}` : "Create a follow-up task."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Send ActBlue link" />
          </div>
          <div>
            <Label>Due at (optional)</Label>
            <Input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
          </div>
          <div>
            <Label>Details (optional)</Label>
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button onClick={submit} disabled={loading}>{loading ? "Saving…" : "Create follow-up"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
