import Link from "next/link";
import { getSessionFromCookies } from "@/lib/auth";

export default async function Page() {
  const session = await getSessionFromCookies();

  return (
    <div className="space-y-6">
      <section className="rounded-xl2 border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)]">
        <div className="text-xs uppercase tracking-[0.24em] text-white/60">Access Control</div>
        <h1 className="mt-1 text-2xl font-semibold">Unauthorized</h1>
        <p className="mt-2 text-sm text-white/65">
          You’re signed in as <span className="font-semibold text-white">{session?.role ?? "unknown"}</span>, but this page is restricted.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard/candidate" className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
            Go to Candidate Dashboard
          </Link>
          <Link href="/dashboard/data-entry" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
            Go to Data Entry
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/45">
          If you need access, ask the CM/Admin to grant permissions (future module adds per-user entitlements).
        </p>
      </section>
    </div>
  );
}
