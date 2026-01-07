"use client";

import type { WidgetDef } from "@cd2/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { WidgetError, WidgetLoading } from "@/components/widgets/WidgetStates";
import { renderWidget } from "@/components/widgets/renderers";

type ViewResult = { ok: boolean; as_of?: string; rows?: any[]; error?: string; meta?: any };

function buildQuery(params: URLSearchParams, supported: string[]) {
  const q = new URLSearchParams();
  for (const k of supported) {
    const v = params.get(k);
    if (v !== null) q.set(k, v);
  }
  const role = params.get("role");
  if (role) q.set("role", role);
  return q;
}

export function WidgetCard({ widget }: { widget: WidgetDef }) {
  const sp = useSearchParams();
  const [data, setData] = useState<ViewResult | null>(null);

  const qs = useMemo(() => buildQuery(sp, widget.filtersSupported as any).toString(), [sp, widget.filtersSupported]);

  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        const url =
          widget.dataSource.kind === "view"
            ? `/api/data/view?name=${encodeURIComponent(widget.dataSource.name)}&${qs}`
            : widget.dataSource.path;

        const res = await fetch(url, { cache: "no-store" });
        const json = (await res.json()) as ViewResult;
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) setData({ ok: false, error: e?.message ?? "Unknown error" });
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [widget.dataSource, qs]);

  const asOf = data?.as_of;

  return (
    <WidgetFrame widget={widget} asOf={asOf}>
      {!data ? (
        <WidgetLoading />
      ) : !data.ok ? (
        <WidgetError error={data.error ?? "Unknown error"} />
      ) : (
        renderWidget(widget, data.rows ?? []) ?? (
          <pre className="max-h-64 overflow-auto rounded-xl border border-white/10 bg-black/20 p-3 text-[11px] text-white/75">
            {JSON.stringify(data.rows?.[0] ?? {}, null, 2)}
          </pre>
        )
      )}
    </WidgetFrame>
  );
}
