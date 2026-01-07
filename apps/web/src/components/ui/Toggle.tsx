"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Toggle({
  checked,
  onCheckedChange,
  label,
  description
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10 transition",
        "focus:outline-none focus:ring-2 focus:ring-white/20"
      )}
      aria-pressed={checked}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium">{label}</div>
          {description ? <div className="text-sm text-white/60">{description}</div> : null}
        </div>
        <div
          className={cn(
            "h-6 w-11 rounded-full border border-white/10 p-1 transition",
            checked ? "bg-white" : "bg-black/40"
          )}
        >
          <div className={cn("h-4 w-4 rounded-full transition", checked ? "translate-x-5 bg-black" : "bg-white")} />
        </div>
      </div>
    </button>
  );
}
