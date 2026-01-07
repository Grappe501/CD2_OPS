"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const next = sp.get("next") ?? "/dashboard/candidate";

  const [mode, setMode] = useState<"email"|"role">("role");

  const [role, setRole] = useState("cm");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(payload: any) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error ?? "Login failed");
    router.push(next);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl2 border border-white/10 bg-white/5 p-8 shadow-[var(--shadow-soft)]">
        <div className="text-xs uppercase tracking-[0.24em] text-white/60">CD2_OPS</div>
        <h1 className="mt-2 text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-white/65">
          Use role login for fast ops, or email login for per-user accounts.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => setMode("role")}
            className={`rounded-lg border border-white/10 px-3 py-2 text-sm ${mode==="role" ? "bg-white/10" : "bg-white/5 hover:bg-white/10"}`}
          >
            Role login
          </button>
          <button
            onClick={() => setMode("email")}
            className={`rounded-lg border border-white/10 px-3 py-2 text-sm ${mode==="email" ? "bg-white/10" : "bg-white/5 hover:bg-white/10"}`}
          >
            Email login
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {mode === "role" ? (
            <>
              <label className="block">
                <div className="text-xs text-white/60">Role</div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                >
                  {["admin","cm","finance","field","comms","data","candidate"].map(r => (
                    <option key={r} value={r} className="bg-[#0b1120]">{r}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="text-xs text-white/60">Password</div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="••••••••"
                />
              </label>

              <button
                disabled={busy}
                onClick={async () => {
                  setMsg(null);
                  setBusy(true);
                  try { await submit({ role, password }); }
                  catch (e: any) { setMsg(e?.message ?? "Login failed"); }
                  finally { setBusy(false); }
                }}
                className="w-full rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 px-4 py-2 text-sm disabled:opacity-60"
              >
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </>
          ) : (
            <>
              <label className="block">
                <div className="text-xs text-white/60">Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="name@campaign.org"
                />
              </label>

              <label className="block">
                <div className="text-xs text-white/60">Password</div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="••••••••"
                />
              </label>

              <button
                disabled={busy}
                onClick={async () => {
                  setMsg(null);
                  setBusy(true);
                  try { await submit({ email, password }); }
                  catch (e: any) { setMsg(e?.message ?? "Login failed"); }
                  finally { setBusy(false); }
                }}
                className="w-full rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 px-4 py-2 text-sm disabled:opacity-60"
              >
                {busy ? "Signing in…" : "Sign in"}
              </button>
            </>
          )}

          {msg ? <div className="text-sm text-rose-100">{msg}</div> : null}
          <div className="text-xs text-white/45">
            Admin can create users + set passwords in Admin → Users.
          </div>
        </div>
      </div>
    </main>
  );
}
