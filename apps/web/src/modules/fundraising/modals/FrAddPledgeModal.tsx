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
  displayName?: string | null;
};

export function FrAddPledgeModal({ open, onOpenChange, prospectId, displayName }: Props) {
  const { toast } = useToast();
  const [amount, setAmount] = React.useState("");
  const [dueBy, setDueBy] = React.useState("");
  const [method, setMethod] = React.useState("ActBlue");
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setAmount("");
    setDueBy("");
    setMethod("ActBlue");
    setNotes("");
  }, [open]);

  async function submit() {
    if (!prospectId) return toast({ title: "Missing prospect", description: "Open from a prospect." });
    if (!amount) return toast({ title: "Amount required", description: "Enter the pledged amount." });

    setLoading(true);
    try {
      const res = await fetch("/api/forms/fundraising/log-pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospect_id: prospectId,
          pledged_amount: Number(amount),
          due_by: dueBy || null,
          method_expected: method || null,
          notes: notes || null
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Failed to save");
      toast({ title: "Pledge saved", description: "Now add a follow-up to collect it." });
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Could not save pledge", description: e?.message || "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add pledge</DialogTitle>
          <DialogDescription>
            {displayName ? `Prospect: ${displayName}` : "Record the pledged amount."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Pledged amount</Label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 500" />
          </div>
          <div>
            <Label>Due by (optional)</Label>
            <Input type="date" value={dueBy} onChange={(e) => setDueBy(e.target.value)} />
          </div>
          <div>
            <Label>Expected method</Label>
            <Input value={method} onChange={(e) => setMethod(e.target.value)} />
          </div>
          <div>
            <Label>Notes (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button onClick={submit} disabled={loading}>{loading ? "Saving…" : "Save pledge"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
