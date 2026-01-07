"use client";

import { useCallback } from "react";

/**
 * Minimal toast shim.
 * If your repo already has shadcn `useToast`, replace this import everywhere with yours.
 */
export function useToast() {
  const toast = useCallback((args: { title: string; description?: string }) => {
    // eslint-disable-next-line no-alert
    alert(args.description ? `${args.title}\n\n${args.description}` : args.title);
  }, []);
  return { toast };
}
