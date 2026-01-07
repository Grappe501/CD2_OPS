"use client";

import * as React from "react";
import { useToast } from "./useToast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function tone(variant: string) {
  if (variant === "success") return "border-emerald-400/20 bg-emerald-500/10";
  if (variant === "error") return "border-rose-400/20 bg-rose-500/10";
  return "border-white/10 bg-white/5";
}

export function ToastViewport() {
  const { items, remove } = useToast();

  return (
    <div className="fixed right-6 top-6 z-[60] flex w-[92vw] max-w-sm flex-col gap-2">
      {items.map((t) => (
        <div key={t.id} className={cn("rounded-xl border p-4 shadow-2xl backdrop-blur", tone(t.variant))} role="status" aria-live="polite">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold">{t.title}</div>
              {t.description ? <div className="mt-1 text-sm text-white/70">{t.description}</div> : null}
              {t.actionLabel && t.onAction ? (
                <div className="mt-2">
                  <Button onClick={() => { t.onAction?.(); remove(t.id); }}>{t.actionLabel}</Button>
                </div>
              ) : null}
            </div>
            <Button variant="ghost" className="px-2" onClick={() => remove(t.id)} aria-label="Dismiss notification">✕</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
