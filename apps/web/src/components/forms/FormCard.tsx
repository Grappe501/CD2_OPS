export function FormCard(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl2 border border-white/10 bg-white/5 p-6 shadow-[var(--shadow-soft)]">
      <div className="text-xs uppercase tracking-[0.24em] text-white/60">Data Entry</div>
      <h2 className="mt-1 text-xl font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-2 text-sm text-white/65">{props.description}</p> : null}
      <div className="mt-5">{props.children}</div>
    </section>
  );
}
