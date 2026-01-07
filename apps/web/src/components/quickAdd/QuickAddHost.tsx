"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NarrativeQuestionModal } from "@/components/modals/NarrativeQuestionModal";
import { NarrativeConfusionModal } from "@/components/modals/NarrativeConfusionModal";
import { StopDoingModal } from "@/components/modals/StopDoingModal";
import { CadenceCommitmentModal } from "@/components/modals/CadenceCommitmentModal";

type QuickAddType = "narrative_question" | "narrative_confusion" | "stop_doing" | "cadence";

export function QuickAddHost() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || "/";

  const t = (sp.get("quickAdd") ?? "") as QuickAddType;

  const close = React.useCallback(() => {
    const next = new URLSearchParams(sp.toString());
    next.delete("quickAdd");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }, [pathname, router, sp]);

  // When quickAdd changes, the right modal opens; closing removes the param
  return (
    <>
      <NarrativeQuestionModal open={t === "narrative_question"} onOpenChange={(o) => !o && close()} />
      <NarrativeConfusionModal open={t === "narrative_confusion"} onOpenChange={(o) => !o && close()} />
      <StopDoingModal open={t === "stop_doing"} onOpenChange={(o) => !o && close()} />
      <CadenceCommitmentModal open={t === "cadence"} onOpenChange={(o) => !o && close()} />
    </>
  );
}
