"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Minimal Dialog implementation (overlay + centered panel).
 * If you already have shadcn/radix Dialog, delete this and use yours.
 */
type DialogCtx = { open: boolean; setOpen: (v: boolean) => void };
const Ctx = React.createContext<DialogCtx | null>(null);

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  return <Ctx.Provider value={{ open, setOpen: onOpenChange }}>{children}</Ctx.Provider>;
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(Ctx);
  if (!ctx?.open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => ctx.setOpen(false)} />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2">
        <div className={cn("rounded-xl border border-white/10 bg-[#0b1220] p-5 shadow-2xl", className)}>{children}</div>
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 space-y-1">{children}</div>;
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("text-lg font-semibold", className)}>{children}</div>;
}

export function DialogDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("text-white/70", className)}>{children}</div>;
}
