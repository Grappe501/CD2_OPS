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

export function FrAiPreCallBriefModal({ open, onOpenChange, prospectId, inputs, displayName }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    setText("");
  }, [open]);

  async function generate() {
    if (!prospectId || !inputs) {
      toast({ title: "Missing info", description: "Open from a prospect row." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/precall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect_id: prospectId, inputs }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "AI failed");
      setText(j.output_text || "");
    } catch (e: any) {
      toast({ title: "AI error", description: e?.message || "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI pre-call brief</DialogTitle>
          <DialogDescription>
            {displayName ? `Prospect: ${displayName}` : "A 15-second brief. Advisory only."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button onClick={generate} disabled={loading}>{loading ? "Generating…" : "Generate brief"}</Button>
          <Textarea value={text} readOnly rows={10} placeholder="AI output will appear here." />
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
