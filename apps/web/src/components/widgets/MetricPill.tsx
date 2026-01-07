import { formatMetric, toneClasses, type StatusTone } from "@/lib/format";

export function MetricPill(props: {
  label: string;
  value: any;
  format: "number" | "integer" | "currency" | "percent" | "days" | "text";
  tone?: StatusTone;
  sublabel?: string;
}) {
  const tone = props.tone ?? "neutral";
  return (
    <div className={`rounded-xl border px-4 py-3 ${toneClasses(tone)}`}>
      <div className="text-xs text-white/70">{props.label}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight">{formatMetric(props.value, props.format)}</div>
      {props.sublabel ? <div className="mt-1 text-xs text-white/60">{props.sublabel}</div> : null}
    </div>
  );
}
