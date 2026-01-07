"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const roles = ["candidate", "cm", "finance", "field", "comms", "data", "admin"] as const;

export function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const current = sp.get("role") ?? "cm";

  return (
    <select
      value={current}
      onChange={(e) => {
        const next = new URLSearchParams(sp.toString());
        next.set("role", e.target.value);
        router.push(`${pathname}?${next.toString()}`);
      }}
      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
    >
      {roles.map((r) => (
        <option key={r} value={r} className="bg-[#0b1120]">
          {r}
        </option>
      ))}
    </select>
  );
}
