"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/modals/useToast";

type Step = 1 | 2 | 3 | 4;

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function OnboardingWizard() {
  const { toast } = useToast();
  const [step, setStep] = React.useState<Step>(1);

  // For “copy/paste” instructions
  const [discordChannelName, setDiscordChannelName] = React.useState("AJAX Organizing Hub");
  const [starterMessage, setStarterMessage] = React.useState("");

  React.useEffect(() => {
    setStarterMessage(
      `Welcome — this is the ${discordChannelName}.

` +
        `If you hear a question from a voter, type /question.
` +
        `If you notice confusion, type /confusion.
` +
        `If we need to lock a commitment, type /cadence.

` +
        `You don’t need to be “good with computers.” Just tell us what you’re seeing.`
    );
  }, [discordChannelName]);

  return (
    <div className="space-y-4">
      {/* Stepper */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((n) => (
          <Button key={n} variant={n === step ? "default" : "secondary"} onClick={() => setStep(n as Step)}>
            Step {n}
          </Button>
        ))}
      </div>

      {step === 1 ? (
        <Card title="Step 1 — What CD2_OPS is (in plain English)">
          <div className="space-y-2 text-white/80">
            <p>
              CD2_OPS is the campaign’s “one screen of truth.” It tells us what’s working, what’s slipping, and what we
              do next — without guessing.
            </p>
            <p>
              If you can click a button and type a sentence, you can use CD2_OPS.
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setStep(2)}>Next</Button>
          </div>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card title="Step 2 — How to report what you’re seeing (fast)">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <div className="font-medium">Option A: In CD2_OPS</div>
              <div className="mt-1 text-sm text-white/70">
                Use the “+ Quick Add” button for voter questions, confusion signals, cadence commitments, and stop-doing.
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <div className="font-medium">Option B: In Discord</div>
              <div className="mt-1 text-sm text-white/70">
                Type <span className="font-mono">/question</span> or <span className="font-mono">/confusion</span>. A form pops up.
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Next</Button>
          </div>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card title="Step 3 — Post the onboarding message in Discord">
          <div className="space-y-2 text-white/80">
            <div className="text-sm">What do you call your Discord?</div>
            <Input value={discordChannelName} onChange={(e) => setDiscordChannelName(e.target.value)} />
            <div className="text-sm pt-2">Copy/paste this message:</div>
            <Textarea value={starterMessage} onChange={(e) => setStarterMessage(e.target.value)} />
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard?.writeText(starterMessage);
                  toast({ title: "Copied", description: "Paste into Discord as a pinned welcome post." });
                }}
              >
                Copy message
              </Button>
              <Button variant="secondary" onClick={() => setStep(4)}>Skip</Button>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)}>Next</Button>
          </div>
        </Card>
      ) : null}

      {step === 4 ? (
        <Card title="Step 4 — What happens after you submit something">
          <div className="space-y-2 text-white/80">
            <p>
              Every submission becomes data on the dashboards. Leadership sees it in the weekly rhythm and responds with
              action.
            </p>
            <ul className="list-disc pl-5 text-sm text-white/70 space-y-1">
              <li>Voter questions → “Top Questions” widget → messaging updates</li>
              <li>Confusion signals → “Confusion Index” → corrective comms</li>
              <li>Cadence commitments → visible due dates → no surprises</li>
              <li>Stop-doing items → protects focus → exceptions only with approval</li>
            </ul>
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
            <Button
              onClick={() => toast({ title: "Onboarding complete", description: "You’re ready. Use Quick Add or Discord /question." })}
            >
              Finish
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
