"use client";

import * as React from "react";

export type ToastVariant = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  createdAt: number;
};

type Ctx = {
  push: (t: Omit<ToastItem, "id" | "createdAt">) => string;
  remove: (id: string) => void;
  items: ToastItem[];
};

const ToastCtx = React.createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const remove = React.useCallback((id: string) => {
    setItems((xs) => xs.filter((x) => x.id !== id));
  }, []);

  const push = React.useCallback((t: Omit<ToastItem, "id" | "createdAt">) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const item: ToastItem = { id, createdAt: Date.now(), ...t };
    setItems((xs) => [item, ...xs].slice(0, 5));
    // auto-dismiss success/info
    if (t.variant !== "error") {
      setTimeout(() => remove(id), 6000);
    }
    return id;
  }, [remove]);

  return React.createElement(ToastCtx.Provider, { value: { push, remove, items } }, children);
}

export function useToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
