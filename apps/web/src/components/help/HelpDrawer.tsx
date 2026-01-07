"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FocusTrap } from "@/components/a11y/FocusTrap";
import { helpForRoute } from "./helpContent";
import { usePathname } from "next/navigation";

export function HelpDrawer() {
  const pathname = usePathname() || "/";
  const topics = helpForRoute(pathname);

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40">
        <Button variant="secondary" onClick={() => setOpen(true)} aria-label="Open help">
          Help
        </Button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[92vw] max-w-md border-r border-white/10 bg-[#0b1220] p-5 shadow-2xl">
            <FocusTrap active={open} onEscape={() => setOpen(false)}>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Help</div>
                <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
              </div>

              <div className="mt-4 space-y-4 overflow-auto pr-2" style={{ maxHeight: "calc(100vh - 96px)" }}>
                {topics.map((t) => (
                  <div key={t.key} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="font-medium">{t.title}</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
                      {t.body.map((line, i) => <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </FocusTrap>
          </div>
        </div>
      ) : null}
    </>
  );
}
