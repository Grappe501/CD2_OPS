"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/modals/useToast";
import { UserPicker } from "./UserPicker";

type LinkRow = {
  discord_user_id: string;
  user_id: string;
  display_name: string | null;
  is_active: boolean;
  updated_at: string;
  full_name: string | null;
  email: string | null;
};

export function DiscordLinkManager() {
  const { toast } = useToast();
  const [discordUserId, setDiscordUserId] = React.useState("");
  const [discordName, setDiscordName] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<{ user_id: string; full_name: string | null; email: string | null; role: string | null } | null>(null);
  const [links, setLinks] = React.useState<LinkRow[]>([]);
  const [loading, setLoading] = React.useState(false);

  async function loadLinks() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/discord/links");
      const json = await res.json();
      setLinks(json.rows ?? []);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadLinks();
  }, []);

  async function link() {
    if (!discordUserId.trim()) return toast({ title: "Discord user id required" });
    if (!selectedUser?.user_id) return toast({ title: "Select a CD2 user" });

    const res = await fetch("/api/admin/discord/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discord_user_id: discordUserId.trim(), user_id: selectedUser.user_id, display_name: discordName || null })
    });
    const json = await res.json();
    if (!json.ok) return toast({ title: "Failed", description: json.error || "Unknown error" });

    toast({ title: "Linked", description: "Discord submissions will now show real names in audit." });
    setDiscordUserId("");
    setDiscordName("");
    setSelectedUser(null);
    await loadLinks();
  }

  async function unlink(discord_user_id: string) {
    const res = await fetch("/api/admin/discord/link", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discord_user_id })
    });
    const json = await res.json();
    if (!json.ok) return toast({ title: "Failed", description: json.error || "Unknown error" });

    toast({ title: "Unlinked", description: "This Discord user will no longer attribute submissions." });
    await loadLinks();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-lg font-semibold">Create / Update Link</div>
          <div className="mt-3 space-y-3">
            <div className="space-y-1">
              <div className="text-sm font-medium">Discord User ID</div>
              <Input value={discordUserId} onChange={(e) => setDiscordUserId(e.target.value)} placeholder="Right click user → Copy User ID" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Discord Display Name (optional)</div>
              <Input value={discordName} onChange={(e) => setDiscordName(e.target.value)} placeholder="Optional cache for quick reference" />
            </div>

            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <div className="text-sm text-white/70 mb-2">Selected CD2 user</div>
              {selectedUser ? (
                <div className="text-sm">
                  <div className="font-medium">{selectedUser.full_name ?? "(no name)"}</div>
                  <div className="text-white/60">{selectedUser.email ?? ""}</div>
                </div>
              ) : (
                <div className="text-sm text-white/50">None selected.</div>
              )}
            </div>

            <Button onClick={link}>Link</Button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-lg font-semibold">Find a user</div>
          <div className="mt-3">
            <UserPicker onSelect={(u) => setSelectedUser(u)} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Existing links</div>
            <div className="text-sm text-white/60">If audit shows “Unknown actor,” link the person here.</div>
          </div>
          <Button variant="secondary" onClick={loadLinks} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</Button>
        </div>

        <div className="mt-3 overflow-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-black/30 text-white/70">
              <tr>
                <th className="p-2 text-left">Discord User ID</th>
                <th className="p-2 text-left">Discord Name</th>
                <th className="p-2 text-left">CD2 User</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Active</th>
                <th className="p-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {links.length === 0 ? (
                <tr><td className="p-3 text-white/50" colSpan={6}>No links yet.</td></tr>
              ) : (
                links.map((r) => (
                  <tr key={r.discord_user_id} className="border-t border-white/10">
                    <td className="p-2 font-mono text-xs">{r.discord_user_id}</td>
                    <td className="p-2">{r.display_name ?? ""}</td>
                    <td className="p-2">{r.full_name ?? r.user_id}</td>
                    <td className="p-2 text-white/60">{r.email ?? ""}</td>
                    <td className="p-2">{r.is_active ? "yes" : "no"}</td>
                    <td className="p-2">
                      {r.is_active ? <Button variant="secondary" onClick={() => unlink(r.discord_user_id)}>Unlink</Button> : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
