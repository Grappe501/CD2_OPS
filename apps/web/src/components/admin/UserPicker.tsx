"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UserRow = { user_id: string; email: string | null; full_name: string | null; role: string | null };

export function UserPicker({ onSelect }: { onSelect: (u: UserRow) => void }) {
  const [q, setQ] = React.useState("");
  const [rows, setRows] = React.useState<UserRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  async function search() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setRows(json.rows ?? []);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (q.trim().length >= 2) search();
    else setRows([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="space-y-2">
      <div className="text-sm text-white/70">Search users</div>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type name or email..." />
      {loading ? <div className="text-sm text-white/60">Searching…</div> : null}
      <div className="max-h-56 overflow-auto rounded-lg border border-white/10">
        {rows.length === 0 ? (
          <div className="p-3 text-sm text-white/50">No results.</div>
        ) : (
          rows.map((u) => (
            <div key={u.user_id} className="flex items-center justify-between gap-3 border-t border-white/10 p-3">
              <div className="min-w-0">
                <div className="truncate font-medium">{u.full_name ?? "(no name)"} <span className="text-white/50">({u.role ?? "role?"})</span></div>
                <div className="truncate text-sm text-white/60">{u.email ?? ""}</div>
              </div>
              <Button onClick={() => onSelect(u)}>Select</Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
