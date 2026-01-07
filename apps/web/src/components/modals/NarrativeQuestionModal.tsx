"use client";

import * as React from "react";
import { ModalShell } from "./_ModalShell";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast/useToast";
import { undo } from "@/lib/undo";
import { required, maxLen, collectErrors, firstErrorByField } from "@/lib/validation";

export function NarrativeQuestionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { push } = useToast();
  const [question, setQuestion] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [county, setCounty] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ field: string; message: string }[]>([]);

  React.useEffect(() => {
    if (!open) {
      setQuestion(""); setTag(""); setCounty(""); setErrors([]); setLoading(false);
    }
  }, [open]);

  async function submit() {
    const errs = collectErrors([
      required(question, "Type the question you heard (one sentence is enough).") && { field: "question", message: required(question, "x")! },
      maxLen(question, 280, "Keep it under 280 characters.") && { field: "question", message: maxLen(question, 280)! }
    ]);
    setErrors(errs);
    if (errs.length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/forms/narrative/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, tag: tag || null, county: county || null, source: "web" })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Save failed");
      const row = json.row;

      push({
        title: "Question captured",
        description: "Thank you — this immediately shapes messaging.",
        variant: "success",
        actionLabel: "Undo",
        onAction: () => undo("narrative_question", row.question_id)
      });

      onOpenChange(false);
    } catch (e: any) {
      push({ title: "Could not save", description: e.message || "Try again.", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  const qErr = firstErrorByField(errors, "question");

  return (
    <ModalShell open={open} onOpenChange={onOpenChange} title="Add voter question">
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">What did the voter ask?</div>
          <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Example: “Is Chris Jones for or against Social Security cuts?”" />
          {qErr ? <div className="text-sm text-rose-300">{qErr}</div> : <div className="text-xs text-white/50">One sentence is enough.</div>}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <div className="text-sm font-medium">Tag (optional)</div>
            <Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Social Security / Jobs / Health" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">County (optional)</div>
            <Input value={county} onChange={(e) => setCounty(e.target.value)} placeholder="Pulaski" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
        </div>
      </div>
    </ModalShell>
  );
}
