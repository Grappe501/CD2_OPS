"use client";

import type { WidgetDef } from "@cd2/core";

export function WidgetFrame(props: {
  widget: WidgetDef;
  asOf?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { widget, asOf, rightSlot, children } = props;

  return (
    <article className="rounded-xl2 border border-white/10 bg-white/5 p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.24em] text-white/60">{widget.ownerRole}</div>
          <h3 className="mt-1 text-lg font-semibold truncate">{widget.title}</h3>
          {widget.description ? <p className="mt-1 text-sm text-white/65">{widget.description}</p> : null}
        </div>

        <div className="flex flex-col items-end gap-1">
          {rightSlot}
          <div className="text-[11px] text-white/55">as_of</div>
          <div className="font-mono text-[11px] text-white/75">{asOf ?? "—"}</div>
        </div>
      </div>

      <div className="mt-4">{children}</div>

      <div className="mt-4 grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-7 rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs text-white/60">Purpose</div>
          <div className="mt-1 text-sm text-white/80">{widget.purpose}</div>
        </div>
        <div className="col-span-12 md:col-span-5 rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs text-white/60">Decision Enabled</div>
          <div className="mt-1 text-sm text-white/80">{widget.decisionEnabled}</div>
        </div>
      </div>
    </article>
  );
}
