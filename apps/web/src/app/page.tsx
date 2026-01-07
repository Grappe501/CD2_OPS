import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-10">
      <div className="max-w-xl w-full rounded-xl2 border border-white/10 bg-white/5 p-8 shadow-[var(--shadow-soft)]">
        <div className="text-sm uppercase tracking-widest text-white/60">CD2_OPS</div>
        <h1 className="mt-3 text-3xl font-bold">Dashboard Shell</h1>
        <p className="mt-3 text-white/70">
          Module 2 — premium UI shell + registry-driven renderer.
        </p>
        <div className="mt-6 flex gap-3">
          <Link className="rounded-lg bg-white/10 hover:bg-white/15 px-4 py-2 border border-white/10"
            href="/dashboard/candidate">Candidate Cockpit</Link>
          <Link className="rounded-lg bg-white/5 hover:bg-white/10 px-4 py-2 border border-white/10"
            href="/dashboard/system-health">System Health</Link>
        </div>
      </div>
    </main>
  );
}
