import { MetricPill } from "@/components/widgets/MetricPill";
import { toneFromPacingStatus } from "@/lib/format";

export function KpiTiles(props: {
  items: Array<{
    label: string;
    value: any;
    format: "number" | "integer" | "currency" | "percent" | "days" | "text";
    tone?: "good" | "warn" | "bad" | "neutral";
    sublabel?: string;
  }>;
}) {
  return (
    <div className="grid grid-cols-12 gap-3">
      {props.items.map((it, idx) => (
        <div key={idx} className="col-span-12 sm:col-span-6 xl:col-span-3">
          <MetricPill {...it} />
        </div>
      ))}
    </div>
  );
}
