"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TourAction =
  | { type: "openQuickAdd"; quickAdd: "narrative_question" | "narrative_confusion" | "stop_doing" | "cadence"; label: string }
  | { type: "navigate"; route: string; label: string };

export function TourActionButton({ action }: { action: TourAction }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const sp = useSearchParams();

  const onClick = () => {
    if (action.type === "navigate") return router.push(action.route);
    const next = new URLSearchParams(sp.toString());
    next.set("quickAdd", action.quickAdd);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return <Button onClick={onClick}>{action.label}</Button>;
}
