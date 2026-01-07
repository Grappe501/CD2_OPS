import Link from "next/link";

const links = [
  { href: "/dashboard/data-entry/call-time", title: "Call Time Log", desc: "Daily calls, connects, dollars raised." },
  { href: "/dashboard/data-entry/decisions", title: "Decision Intake", desc: "Capture decisions, owners, due dates." },
  { href: "/dashboard/data-entry/risks", title: "Risk Register", desc: "Track risks, severity, triggers, signals." },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl2 border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)]">
        <div className="text-xs uppercase tracking-[0.24em] text-white/60">Data Entry</div>
        <h1 className="mt-1 text-2xl font-semibold">Operations Intake</h1>
        <p className="mt-2 text-sm text-white/65">
          Fast, reliable inputs that power views and dashboards. Every submission writes an audit event.
        </p>
      </section>

      <section className="grid grid-cols-12 gap-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="col-span-12 xl:col-span-4 rounded-xl2 border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition">
            <div className="text-lg font-semibold">{l.title}</div>
            <div className="mt-2 text-sm text-white/65">{l.desc}</div>
            <div className="mt-4 text-xs text-white/50">Open →</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
