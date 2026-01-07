"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast/useToast";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prospectId?: string | null;
  inputs?: Record<string, any> | null;
  displayName?: string | null;
};

export function FrAiFollowupDraftModal({ open, onOpenChange, prospectId, inputs, displayName }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  const [text, setText] = React.useState("");
  const [suggestionId, setSuggestionId] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string>("");

  React.useEffect(() => {
    if (!open) return;
    setText("");
    setSuggestionId(null);
    setStatus("");
  }, [open]);

  async function generate() {
    if (!prospectId || !inputs) {
      toast({ title: "Missing info", description: "Open from a prospect row." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect_id: prospectId, inputs }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "AI failed");
      setText(j.output_text || "");
      setSuggestionId(j.suggestion?.suggestion_id || null);
      setStatus(j.suggestion?.status || "");
    } catch (e: any) {
      toast({ title: "AI error", description: e?.message || "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  async function approve() {
    if (!suggestionId) return;
    setApproving(true);
    try {
      const res = await fetch("/api/ai/suggestions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestion_id: suggestionId }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Approve failed");
      setStatus("approved");
      toast({ title: "Approved", description: "Now paste/send via your preferred channel." });
    } catch (e: any) {
      toast({ title: "Approve error", description: e?.message || "Unknown error" });
    } finally {
      setApproving(false);
    }
  }

  async function reject() {
    if (!suggestionId) return;
    setApproving(true);
    try {
      const res = await fetch("/api/ai/suggestions/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestion_id: suggestionId }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Reject failed");
      setStatus("rejected");
      toast({ title: "Rejected", description: "Generate again or write manually." });
    } catch (e: any) {
      toast({ title: "Reject error", description: e?.message || "Unknown error" });
    } finally {
      setApproving(false);
    }
  }

  const needsApproval = status === "generated";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI follow-up draft</DialogTitle>
          <DialogDescription>
            {displayName ? `Prospect: ${displayName}` : "Generate a follow-up email/text. Approval required."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button onClick={generate} disabled={loading}>{loading ? "Generating…" : "Generate draft"}</Button>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} placeholder="AI output will appear here." />

          <div className="flex flex-wrap justify-between gap-2">
            <div className="text-sm opacity-70">Status: {status || "—"}</div>
            <div className="flex gap-2">
              {needsApproval ? (
                <>
                  <Button variant="secondary" onClick={reject} disabled={approving}>Reject</Button>
                  <Button onClick={approve} disabled={approving}>{approving ? "Saving…" : "Approve"}</Button>
                </>
              ) : null}
              <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
