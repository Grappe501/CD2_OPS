export type MetricFormat = "number" | "integer" | "currency" | "percent" | "days" | "text";

const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const cf0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const pf0 = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });
const pf1 = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });

export function formatMetric(value: any, fmt: MetricFormat): string {
  if (value === null || value === undefined) return "—";
  if (fmt === "text") return String(value);

  const n = Number(value);
  if (!Number.isFinite(n)) return "—";

  switch (fmt) {
    case "integer":
      return nf0.format(Math.round(n));
    case "number":
      return nf1.format(n);
    case "currency":
      return cf0.format(n);
    case "percent":
      // assumes 0..1 if <=1.5, else assumes already percent
      const p = n <= 1.5 ? n : n / 100;
      return (Math.abs(p) < 0.01 ? pf1 : pf0).format(p);
    case "days":
      return `${nf0.format(Math.round(n))}d`;
    default:
      return nf2.format(n);
  }
}

export function formatISODateTime(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export type StatusTone = "good" | "warn" | "bad" | "neutral";

export function toneFromPacingStatus(s?: string): StatusTone {
  const v = (s ?? "").toLowerCase();
  if (["on_track", "green", "good"].includes(v)) return "good";
  if (["at_risk", "yellow", "warning"].includes(v)) return "warn";
  if (["behind", "missed", "red", "triggered"].includes(v)) return "bad";
  return "neutral";
}

export function toneClasses(t: StatusTone): string {
  switch (t) {
    case "good":
      return "border-emerald-400/25 bg-emerald-400/10 text-emerald-100";
    case "warn":
      return "border-amber-300/25 bg-amber-300/10 text-amber-100";
    case "bad":
      return "border-rose-300/25 bg-rose-300/10 text-rose-100";
    default:
      return "border-white/10 bg-white/5 text-white/80";
  }
}
