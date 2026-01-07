"use client";

import * as React from "react";
import { ToastProvider as Provider } from "./useToast";
import { ToastViewport } from "./ToastViewport";

export function ToastRoot({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      {children}
      <ToastViewport />
    </Provider>
  );
}
