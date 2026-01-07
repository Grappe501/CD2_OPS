"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

type FilterKey = "date_range" | "county" | "lane";

const DATE_OPTIONS = [
  { v: "today", label: "Today" },
  { v: "last_7_days", label: "Last 7 Days" },
  { v: "last_30_days", label: "Last 30 Days" },
  { v: "wtd", label: "Week-to-date" },
  { v: "mtd", label: "Month-to-date" },
] as const;

function pill(active: boolean) {
  return clsx(
    "rounded-full px-3 py-1 text-xs border transition",
    active ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10 hover:bg-white/10"
  );
}

export function GlobalFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function setFilter(key: FilterKey, value: string) {
    const next = new URLSearchParams(sp.toString());
    next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  }

  const date = sp.get("date_range") ?? "last_7_days";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-xs text-white/55 mr-2">Filters:</div>

      <div className="flex flex-wrap items-center gap-2">
        {DATE_OPTIONS.map((o) => (
          <button key={o.v} className={pill(o.v === date)} onClick={() => setFilter("date_range", o.v)}>
            {o.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <input
          className="w-40 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
          placeholder="County"
          defaultValue={sp.get("county") ?? ""}
          onBlur={(e) => setFilter("county", e.target.value || "all")}
        />
        <input
          className="w-40 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Lane"
          defaultValue={sp.get("lane") ?? ""}
          onBlur={(e) => setFilter("lane", e.target.value || "all")}
        />
      </div>
    </div>
  );
}
