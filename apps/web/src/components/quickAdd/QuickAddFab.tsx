"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StopDoingModal } from "@/components/modals/StopDoingModal";
import { CadenceModal } from "@/components/modals/CadenceModal";
import { NarrativeQuestionModal } from "@/components/modals/NarrativeQuestionModal";
import { ConfusionSignalModal } from "@/components/modals/ConfusionSignalModal";
import { MessageDisciplineModal } from "@/components/modals/MessageDisciplineModal";

type Mode = "stop_doing" | "cadence" | "question" | "confusion" | "message";

export function QuickAddFab({ defaultMode = "question" }: { defaultMode?: Mode }) {
  const [mode, setMode] = React.useState<Mode>(defaultMode);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <div className="rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur">
          <div className="mb-2 text-xs text-white/70">Quick Add</div>
          <div className="flex flex-col gap-1">
            <Button variant="secondary" className="justify-start" onClick={() => { setMode("stop_doing"); setOpen(true); }}>Stop-Doing</Button>
            <Button variant="secondary" className="justify-start" onClick={() => { setMode("cadence"); setOpen(true); }}>Cadence</Button>
            <Button variant="secondary" className="justify-start" onClick={() => { setMode("question"); setOpen(true); }}>Voter Question</Button>
            <Button variant="secondary" className="justify-start" onClick={() => { setMode("confusion"); setOpen(true); }}>Confusion Signal</Button>
            <Button variant="secondary" className="justify-start" onClick={() => { setMode("message"); setOpen(true); }}>Message Discipline</Button>
          </div>
        </div>
        <Button className="h-12 w-12 rounded-full text-xl" onClick={() => setOpen(true)}>+</Button>
      </div>

      {mode === "stop_doing" ? <StopDoingModal open={open} onOpenChange={setOpen} /> : null}
      {mode === "cadence" ? <CadenceModal open={open} onOpenChange={setOpen} /> : null}
      {mode === "question" ? <NarrativeQuestionModal open={open} onOpenChange={setOpen} /> : null}
      {mode === "confusion" ? <ConfusionSignalModal open={open} onOpenChange={setOpen} /> : null}
      {mode === "message" ? <MessageDisciplineModal open={open} onOpenChange={setOpen} /> : null}
    </>
  );
}
