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
  displayName?: string | null;
  phone?: string | null;
  // inputs used for AI brief/followup if you want to pass them in (optional)
  aiInputs?: Record<string, any> | null;
  defaultSessionId?: string | null;
};

type Step = "brief" | "call" | "outcome" | "pledge" | "followup" | "done";

const OUTCOMES = [
  { key: "talked", label: "1. Talked" },
  { key: "left_vm", label: "2. Left voicemail" },
  { key: "no_answer", label: "3. No answer" },
  { key: "scheduled_callback", label: "4. Scheduled callback" },
  { key: "refused", label: "5. Refused" },
  { key: "wrong_number", label: "6. Wrong number" },
  { key: "bad_number", label: "7. Bad number" },
] as const;

export function FrCallFlowModal({ open, onOpenChange, prospectId, displayName, phone, aiInputs, defaultSessionId }: Props) {
  const { toast } = useToast();
  const [step, setStep] = React.useState<Step>("brief");
  const [loading, setLoading] = React.useState(false);

  // Call
  const [outcome, setOutcome] = React.useState<string>("talked");
  const [durationSeconds, setDurationSeconds] = React.useState<string>("");
  const [callNotes, setCallNotes] = React.useState<string>("");

  // Pledge
  const [pledgeAmount, setPledgeAmount] = React.useState<string>("");
  const [pledgeDueBy, setPledgeDueBy] = React.useState<string>("");
  const [pledgeMethod, setPledgeMethod] = React.useState<string>("ActBlue");
  const [pledgeNotes, setPledgeNotes] = React.useState<string>("");

  // Follow-up
  const [followupTitle, setFollowupTitle] = React.useState<string>("Send donation link + thank you");
  const [followupDueAt, setFollowupDueAt] = React.useState<string>("");
  const [followupDetails, setFollowupDetails] = React.useState<string>("");

  // AI brief text
  const [briefText, setBriefText] = React.useState<string>("");

  React.useEffect(() => {
    if (!open) return;
    setStep("brief");
    setOutcome("talked");
    setDurationSeconds("");
    setCallNotes("");
    setPledgeAmount("");
    setPledgeDueBy("");
    setPledgeMethod("ActBlue");
    setPledgeNotes("");
    setFollowupTitle("Send donation link + thank you");
    setFollowupDueAt("");
    setFollowupDetails("");
    setBriefText("");
  }, [open]);

  // keyboard shortcuts on the outcome step
  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (step === "outcome") {
        const n = Number(e.key);
        if (n >= 1 && n <= 7) {
          setOutcome(OUTCOMES[n - 1].key);
          e.preventDefault();
        }
        if (e.key === "Enter") {
          // advance to pledge step quickly
          setStep("pledge");
          e.preventDefault();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, step]);

  async function genBrief() {
    if (!prospectId || !aiInputs) {
      toast({ title: "AI brief unavailable", description: "No AI inputs were provided." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ai/precall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect_id: prospectId, inputs: aiInputs }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "AI failed");
      setBriefText(j.output_text || "");
    } catch (e: any) {
      toast({ title: "AI error", description: e?.message || "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  async function saveAll() {
    if (!prospectId) {
      toast({ title: "Missing prospect", description: "Close and reopen from a prospect row." });
      return;
    }
    setLoading(true);
    try {
      const payload: any = {
        session_id: defaultSessionId,
        prospect_id: prospectId,
        call: {
          outcome,
          duration_seconds: durationSeconds ? Number(durationSeconds) : null,
          notes: callNotes || null,
        },
      };

      if (pledgeAmount) {
        payload.pledge = {
          pledged_amount: Number(pledgeAmount),
          due_by: pledgeDueBy || null,
          method_expected: pledgeMethod || null,
          notes: pledgeNotes || null,
        };
      }

      // Auto-followup rule:
      // If a pledge is present and follow-up title is empty, auto-fill it.
      const autoTitle = pledgeAmount ? "Send payment link + thank you (pledge recorded)" : null;
      const title = (followupTitle || "").trim() || (autoTitle ?? "");

      if (title) {
        payload.followup = {
          title,
          followup_type: "send_link",
          details: followupDetails || null,
          due_at: followupDueAt || null,
        };
      }

      const res = await fetch("/api/forms/fundraising/log-callflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Save failed");

      toast({ title: "Saved", description: "Call flow logged." });
      setStep("done");
    } catch (e: any) {
      toast({ title: "Could not save", description: e?.message || "Unknown error" });
    } finally {
      setLoading(false);
    }
  }

  function header() {
    return (
      <DialogHeader>
        <DialogTitle>Call Flow</DialogTitle>
        <DialogDescription>
          {displayName ? `Prospect: ${displayName}` : "Log the call in one smooth flow."}
        </DialogDescription>
      </DialogHeader>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        {header()}

        {/* Stepper */}
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {["brief","call","outcome","pledge","followup","done"].map((s) => (
            <div
              key={s}
              className={[
                "rounded-full border px-3 py-1",
                step === (s as Step) ? "bg-primary text-primary-foreground" : "opacity-70",
              ].join(" ")}
            >
              {s.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          {step === "brief" ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm opacity-80">
                  Optional. If AI is enabled and inputs exist, generate a 15-second brief.
                </div>
                <Button className="btn-elder" onClick={genBrief} disabled={loading}>
                  {loading ? "Generating…" : "Generate AI brief"}
                </Button>
              </div>
              <Textarea readOnly rows={8} value={briefText} placeholder="AI brief will appear here." />
              <div className="flex justify-end gap-2">
                <Button className="btn-elder" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button className="btn-elder" onClick={() => setStep("call")}>Next</Button>
              </div>
            </div>
          ) : null}

          {step === "call" ? (
            <div className="space-y-3">
              <div className="rounded-lg border p-4 card-elder">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{displayName || "Prospect"}</div>
                    <div className="text-sm opacity-70">{phone || "No phone on file"}</div>
                  </div>
                  <div className="flex gap-2">
                    {phone ? (
                      <Button className="btn-elder" asChild>
                        <a href={`tel:${phone}`}>Call now</a>
                      </Button>
                    ) : null}
                    <Button className="btn-elder" variant="secondary" onClick={() => setStep("outcome")}>
                      I already called
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button className="btn-elder" variant="secondary" onClick={() => setStep("brief")}>Back</Button>
                <Button className="btn-elder" onClick={() => setStep("outcome")}>Next</Button>
              </div>
            </div>
          ) : null}

          {step === "outcome" ? (
            <div className="space-y-3">
              <div>
                <Label>Outcome (press 1–7)</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {OUTCOMES.map(o => (
                    <Button
                      key={o.key}
                      className="btn-elder"
                      type="button"
                      variant={outcome === o.key ? "default" : "secondary"}
                      onClick={() => setOutcome(o.key)}
                    >
                      {o.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Talk time (seconds)</Label>
                  <Input className="btn-elder" value={durationSeconds} onChange={(e) => setDurationSeconds(e.target.value)} placeholder="e.g., 180" />
                </div>
                <div className="text-sm opacity-70 self-end">
                  Tip: Press <b>Enter</b> to jump to Pledge.
                </div>
              </div>

              <div>
                <Label>Notes (optional)</Label>
                <Textarea value={callNotes} onChange={(e) => setCallNotes(e.target.value)} placeholder="Key info / commitment / objections" />
              </div>

              <div className="flex justify-end gap-2">
                <Button className="btn-elder" variant="secondary" onClick={() => setStep("call")}>Back</Button>
                <Button className="btn-elder" onClick={() => setStep("pledge")}>Next</Button>
              </div>
            </div>
          ) : null}

          {step === "pledge" ? (
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label>Pledge amount (optional)</Label>
                  <Input className="btn-elder" value={pledgeAmount} onChange={(e) => setPledgeAmount(e.target.value)} placeholder="e.g., 500" />
                </div>
                <div>
                  <Label>Due by</Label>
                  <Input className="btn-elder" type="date" value={pledgeDueBy} onChange={(e) => setPledgeDueBy(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label>Expected method</Label>
                  <Input className="btn-elder" value={pledgeMethod} onChange={(e) => setPledgeMethod(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Pledge notes (optional)</Label>
                <Textarea value={pledgeNotes} onChange={(e) => setPledgeNotes(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2">
                <Button className="btn-elder" variant="secondary" onClick={() => setStep("outcome")}>Back</Button>
                <Button className="btn-elder" onClick={() => setStep("followup")}>Next</Button>
              </div>
            </div>
          ) : null}

          {step === "followup" ? (
            <div className="space-y-3">
              <div>
                <Label>Follow-up title (recommended)</Label>
                <Input className="btn-elder" value={followupTitle} onChange={(e) => setFollowupTitle(e.target.value)} />
              </div>
              <div>
                <Label>Due at</Label>
                <Input className="btn-elder" type="datetime-local" value={followupDueAt} onChange={(e) => setFollowupDueAt(e.target.value)} />
              </div>
              <div>
                <Label>Details</Label>
                <Textarea value={followupDetails} onChange={(e) => setFollowupDetails(e.target.value)} placeholder="What exactly should be sent or done?" />
              </div>

              <div className="flex justify-end gap-2">
                <Button className="btn-elder" variant="secondary" onClick={() => setStep("pledge")}>Back</Button>
                <Button className="btn-elder" onClick={saveAll} disabled={loading}>
                  {loading ? "Saving…" : "Save everything"}
                </Button>
              </div>
            </div>
          ) : null}

          {step === "done" ? (
            <div className="space-y-3">
              <div className="rounded-lg border p-4 card-elder">
                <div className="text-lg font-semibold">All set.</div>
                <div className="text-sm opacity-70">The call, pledge, and follow-up have been recorded.</div>
              </div>
              <div className="flex justify-end gap-2">
                <Button className="btn-elder" variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
