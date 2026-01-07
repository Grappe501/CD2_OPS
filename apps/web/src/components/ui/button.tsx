"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "ghost" };

export function Button({ className, variant = "default", ...props }: Props) {
  const styles =
    variant === "secondary"
      ? "bg-white/10 hover:bg-white/15 text-white"
      : variant === "ghost"
      ? "bg-transparent hover:bg-white/10 text-white"
      : "bg-white text-black hover:bg-white/90";
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50",
        styles,
        className
      )}
      {...props}
    />
  );
}
