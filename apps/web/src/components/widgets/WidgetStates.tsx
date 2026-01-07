export function WidgetLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-48 rounded bg-white/10" />
      <div className="mt-3 h-10 w-full rounded bg-white/10" />
      <div className="mt-3 h-10 w-3/4 rounded bg-white/10" />
    </div>
  );
}

export function WidgetEmpty({ label = "No data for current filters." }: { label?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-6 text-sm text-white/65">
      {label}
    </div>
  );
}

export function WidgetError({ error }: { error: string }) {
  return (
    <div className="rounded-xl border border-rose-300/20 bg-rose-300/10 p-6 text-sm text-rose-100">
      {error}
    </div>
  );
}
