"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type EmptyAction =
  | { label: string; action: "openQuickAdd"; payload: { type: string } }
  | { label: string; route: string };

export function RegistryEmptyStateCTA({ primary, secondary }: { primary?: EmptyAction; secondary?: EmptyAction }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const sp = useSearchParams();

  function openQuickAdd(type: string) {
    const next = new URLSearchParams(sp.toString());
    next.set("quickAdd", type);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function go(route: string) {
    router.push(route);
  }

  function render(a?: EmptyAction, variant: "default" | "secondary" = "default") {
    if (!a) return null;
    if ("action" in a && a.action === "openQuickAdd") {
      return <Button variant={variant} onClick={() => openQuickAdd(a.payload.type)}>{a.label}</Button>;
    }
    if ("route" in a) {
      return <Button variant={variant} onClick={() => go(a.route)}>{a.label}</Button>;
    }
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {render(primary, "default")}
      {render(secondary, "secondary")}
    </div>
  );
}
