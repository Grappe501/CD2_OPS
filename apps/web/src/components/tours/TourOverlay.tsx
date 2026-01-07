"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FocusTrap } from "@/components/a11y/FocusTrap";
import type { Tour } from "./tours";

export function TourOverlay({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [i, setI] = React.useState(0);
  const step = tour.steps[i];

  const isLast = i === tour.steps.length - 1;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2">
        <FocusTrap active={true} onEscape={onClose}>
          <div className="rounded-xl border border-white/10 bg-[#0b1220] p-5 shadow-2xl">
            <div className="text-sm text-white/60">{tour.name}</div>
            <div className="mt-1 text-xl font-semibold">{step.title}</div>
            <div className="mt-2 text-white/80">{step.body}</div>

            <div className="mt-4 flex items-center justify-between">
              <Button variant="secondary" onClick={onClose}>Close</Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>Back</Button>
                <Button onClick={() => (isLast ? onClose() : setI(i + 1))}>
                  {isLast ? "Done" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </FocusTrap>
      </div>
    </div>
  );
}
