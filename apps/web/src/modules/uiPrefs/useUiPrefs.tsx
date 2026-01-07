"use client";

import * as React from "react";

type UiPrefs = {
  elderMode: boolean;
  reducedMotion: boolean;
};

const KEY = "cd2_ops_ui_prefs_v1";

function load(): UiPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { elderMode: false, reducedMotion: false };
    const j = JSON.parse(raw);
    return {
      elderMode: Boolean(j.elderMode),
      reducedMotion: Boolean(j.reducedMotion),
    };
  } catch {
    return { elderMode: false, reducedMotion: false };
  }
}

function save(p: UiPrefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

const Ctx = React.createContext<{
  prefs: UiPrefs;
  setPrefs: (next: UiPrefs) => void;
  toggleElderMode: () => void;
} | null>(null);

export function UiPrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = React.useState<UiPrefs>({ elderMode: false, reducedMotion: false });

  React.useEffect(() => {
    const p = load();
    setPrefsState(p);
  }, []);

  React.useEffect(() => {
    save(prefs);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.elder = prefs.elderMode ? "true" : "false";
      document.documentElement.dataset.reducedMotion = prefs.reducedMotion ? "true" : "false";
    }
  }, [prefs]);

  function setPrefs(next: UiPrefs) {
    setPrefsState(next);
  }

  function toggleElderMode() {
    setPrefsState((p) => ({ ...p, elderMode: !p.elderMode }));
  }

  return (
    <Ctx.Provider value={{ prefs, setPrefs, toggleElderMode }}>
      {children}
    </Ctx.Provider>
  );
}

export function useUiPrefs() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useUiPrefs must be used within UiPrefsProvider");
  return v;
}
