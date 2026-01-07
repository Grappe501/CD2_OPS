import * as React from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  body,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary
}: {
  title: string;
  body: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-white/70">{body}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {primaryLabel && onPrimary ? <Button onClick={onPrimary}>{primaryLabel}</Button> : null}
        {secondaryLabel && onSecondary ? <Button variant="secondary" onClick={onSecondary}>{secondaryLabel}</Button> : null}
      </div>
    </div>
  );
}
