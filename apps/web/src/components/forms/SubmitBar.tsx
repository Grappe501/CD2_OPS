"use client";

import { useState } from "react";

export function SubmitBar(props: { submitLabel: string; onSubmit: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setMsg(null);
          setBusy(true);
          try {
            await props.onSubmit();
            setMsg("Saved.");
          } catch (e: any) {
            setMsg(e?.message ?? "Failed.");
          } finally {
            setBusy(false);
          }
        }}
        className="rounded-lg border border-white/10 bg-white/10 hover:bg-white/15 px-4 py-2 text-sm disabled:opacity-60"
      >
        {busy ? "Saving…" : props.submitLabel}
      </button>

      {msg ? (
        <div className="text-sm text-white/70">{msg}</div>
      ) : (
        <div className="text-xs text-white/50">Writes to Postgres + logs audit.</div>
      )}
    </div>
  );
}
