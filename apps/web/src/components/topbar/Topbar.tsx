"use client";

import { useEffect, useState } from "react";
import type { Role } from "@cd2/core";

type Session = { sub: string; role: Role; name?: string };

export function Topbar() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(r => r.json())
      .then(j => setSession(j.session ?? null))
      .catch(() => setSession(null));
  }, []);

  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-[#070b14]/80 backdrop-blur">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="min-w-0">
          <div className="text-xs text-white/50">Session</div>
          <div className="truncate text-sm font-semibold">
            {session ? `${session.name ?? "User"} · ${session.role}` : "—"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/dashboard/audit"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Audit
          </a>

          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
