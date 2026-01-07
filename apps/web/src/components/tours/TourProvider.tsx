"use client";

import * as React from "react";
import { TOURS, Tour } from "./tours";
import { TourOverlay } from "./TourOverlay";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

type CtxT = {
  startTour: (key: string) => void;
};
const Ctx = React.createContext<CtxT | null>(null);

function guessTour(pathname: string): string | null {
  if (pathname.includes("/dashboard/narrative")) return "narrative";
  if (pathname.includes("/dashboard/cm")) return "cm";
  return null;
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const [active, setActive] = React.useState<Tour | null>(null);

  function startTour(key: string) {
    const t = TOURS.find((x) => x.key === key) || null;
    setActive(t);
  }

  const suggested = guessTour(pathname);

  return (
    <Ctx.Provider value={{ startTour }}>
      {children}

      {/* Tour chip */}
      {suggested ? (
        <div className="fixed top-20 right-6 z-40">
          <Button variant="secondary" onClick={() => startTour(suggested)} aria-label="Start guided tour">
            Guided Tour
          </Button>
        </div>
      ) : null}

      {active ? <TourOverlay tour={active} onClose={() => setActive(null)} /> : null}
    </Ctx.Provider>
  );
}

export function useTours() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useTours must be used within TourProvider");
  return ctx;
}
