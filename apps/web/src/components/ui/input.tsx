"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * If your repo already has shadcn Input/Textarea components, delete this file.
 */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none",
        "placeholder:text-white/40 focus:ring-2 focus:ring-white/20",
        className
      )}
      {...props}
    />
  );
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[96px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none",
        "placeholder:text-white/40 focus:ring-2 focus:ring-white/20",
        className
      )}
      {...props}
    />
  );
});
