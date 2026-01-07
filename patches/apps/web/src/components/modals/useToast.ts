"use client";

/**
 * PATCH: replace the alert-based toast shim with the real toast provider.
 * This keeps existing imports working: `import { useToast } from "@/components/modals/useToast"`
 */
import { useToast as useToastCore } from "@/components/toast/useToast";

export function useToast() {
  const { push } = useToastCore();
  return {
    toast: ({ title, description }: { title: string; description?: string }) => push({ title, description, variant: "info" })
  };
}
