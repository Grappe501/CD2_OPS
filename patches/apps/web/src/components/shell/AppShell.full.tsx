"use client";

import * as React from "react";
import { ToastRoot } from "@/components/toast/ToastProvider";
import { HelpDrawer } from "@/components/help/HelpDrawer";
import { TourProvider } from "@/components/tours/TourProvider";
import { Toggle } from "@/components/ui/Toggle";
import { applyPrefsToDocument, loadPrefs, savePrefs } from "@/lib/preferences";
import { Button } from "@/components/ui/button";
import { QuickAddHost } from "@/components/quickadd/QuickAddHost";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = React.useState(() => ({ largeType: false, highContrast: false }));
  const [prefsOpen, setPrefsOpen] = React.useState(false);

  React.useEffect(() => {
    const p = loadPrefs();
    setPrefs(p);
    applyPrefsToDocument(p);
  }, []);

  function update(next: typeof prefs) {
    setPrefs(next);
    savePrefs(next);
    applyPrefsToDocument(next);
  }

  return (
    <ToastRoot>
      <TourProvider>
        <div className="min-h-screen">
          {/* Display preferences chip */}
          <div className="fixed top-20 left-6 z-40">
            <Button variant="secondary" onClick={() => setPrefsOpen(true)}>Display</Button>
          </div>

          {prefsOpen ? (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/60" onClick={() => setPrefsOpen(false)} />
              <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2">
                <div className="rounded-xl border border-white/10 bg-[#0b1220] p-5 shadow-2xl">
                  <div className="text-xl font-semibold">Display</div>
                  <div className="mt-3 space-y-2">
                    <Toggle
                      checked={prefs.largeType}
                      onCheckedChange={(v) => update({ ...prefs, largeType: v })}
                      label="Large type"
                      description="Bigger text and spacing for easier reading."
                    />
                    <Toggle
                      checked={prefs.highContrast}
                      onCheckedChange={(v) => update({ ...prefs, highContrast: v })}
                      label="High contrast"
                      description="Higher contrast UI for visibility."
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => setPrefsOpen(false)}>Done</Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {children}

          {/* global helpers */}
          <QuickAddHost />
          <HelpDrawer />
        </div>
      </TourProvider>
    </ToastRoot>
  );
}
