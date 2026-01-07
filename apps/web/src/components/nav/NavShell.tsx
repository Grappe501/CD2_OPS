"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { NavItem, Role } from "@cd2/core";
import { NAV } from "@cd2/core";

function groupItems(items: NavItem[]) {
  const groups: Record<string, NavItem[]> = {};
  for (const i of items) {
    groups[i.group] = groups[i.group] ?? [];
    groups[i.group].push(i);
  }
  return groups;
}

export function NavShell(props: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = useMemo(() => NAV.filter(i => i.roles.includes(props.role)), [props.role]);
  const groups = useMemo(() => groupItems(items), [items]);

  useEffect(() => { setOpen(false); }, [pathname]);

  const navList = (
    <nav className="space-y-6">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group}>
          <div className="px-3 text-xs uppercase tracking-[0.24em] text-white/45">{group}</div>
          <div className="mt-2 space-y-1">
            {items.map((i) => {
              const active = pathname === i.href;
              return (
                <Link
                  key={i.key}
                  href={i.href}
                  className={[
                    "block rounded-lg px-3 py-2 text-sm transition",
                    active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                  ].join(" ")}
                >
                  {i.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/90 backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Menu
          </button>
          <div className="text-sm font-semibold">CD2_OPS</div>
          <div className="w-16" />
        </div>
        {open ? (
          <div className="p-4">{navList}</div>
        ) : null}
      </div>

      <div className="grid grid-cols-12">
        {/* Desktop rail */}
        <aside className="hidden lg:block col-span-3 xl:col-span-2 border-r border-white/10 bg-[#070b14] p-5 sticky top-0 h-screen overflow-auto">
          <div className="text-xs uppercase tracking-[0.24em] text-white/50">CD2_OPS</div>
          <div className="mt-1 text-lg font-semibold">Operations</div>
          <div className="mt-6">{navList}</div>
        </aside>

        <main className="col-span-12 lg:col-span-9 xl:col-span-10">
          {props.children}
        </main>
      </div>
    </div>
  );
}
