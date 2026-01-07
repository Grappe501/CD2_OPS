"use client";

import * as React from "react";

/**
 * Lightweight focus trap for modals/drawers if Radix isn't present yet.
 * - traps Tab key inside container
 * - closes on Escape via optional onEscape
 */
export function FocusTrap({
  active,
  onEscape,
  children
}: {
  active: boolean;
  onEscape?: () => void;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    const focusables = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
        )
      ).filter((n) => !n.hasAttribute("disabled"));

    const first = () => focusables()[0];
    const last = () => {
      const f = focusables();
      return f[f.length - 1];
    };

    const prevActive = document.activeElement as HTMLElement | null;
    first()?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape?.();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (f.length === 0) return;

      const f1 = first();
      const fl = last();
      if (!f1 || !fl) return;

      if (e.shiftKey && document.activeElement === f1) {
        e.preventDefault();
        fl.focus();
      } else if (!e.shiftKey && document.activeElement === fl) {
        e.preventDefault();
        f1.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      prevActive?.focus?.();
    };
  }, [active, onEscape]);

  return <div ref={ref}>{children}</div>;
}
