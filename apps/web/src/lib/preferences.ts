"use client";

export type UiPrefs = {
  largeType: boolean;
  highContrast: boolean;
};

const KEY = "cd2_ops_ui_prefs_v1";

export function loadPrefs(): UiPrefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { largeType: false, highContrast: false };
    const p = JSON.parse(raw);
    return { largeType: !!p.largeType, highContrast: !!p.highContrast };
  } catch {
    return { largeType: false, highContrast: false };
  }
}

export function savePrefs(p: UiPrefs) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function applyPrefsToDocument(p: UiPrefs) {
  const root = document.documentElement;
  root.dataset.largeType = p.largeType ? "1" : "0";
  root.dataset.highContrast = p.highContrast ? "1" : "0";
}
