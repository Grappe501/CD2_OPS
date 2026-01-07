"use client";

import * as React from "react";
import { FocusTrap } from "@/components/a11y/FocusTrap";
import { Button } from "@/components/ui/button";

export function ModalShell({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={() => onOpenChange(false)} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2">
        <FocusTrap active={open} onEscape={() => onOpenChange(false)}>
          <div className="rounded-xl border border-white/10 bg-[#0b1220] p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xl font-semibold">{title}</div>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
            </div>
            <div className="mt-4">{children}</div>
          </div>
        </FocusTrap>
      </div>
    </div>
  );
}
