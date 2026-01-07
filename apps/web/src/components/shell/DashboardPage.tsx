import { WIDGETS } from "@cd2/core";
import type { PageKey } from "@cd2/core";
import { WidgetCard } from "@/components/widgets/WidgetCard";

export function DashboardPage({ pageKey }: { pageKey: PageKey }) {
  const widgets = WIDGETS.filter((w) => w.pageKey === pageKey);

  return (
    <div className="space-y-6">
      <section className="rounded-xl2 border border-white/10 bg-white/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/60">Page Key</div>
            <div className="mt-1 text-xl font-semibold">{pageKey}</div>
            <div className="mt-2 text-sm text-white/65">
              Widgets below are rendered from <code className="text-white/80">packages/core/src/widgets.ts</code>.
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-xs text-white/60">Widgets</div>
            <div className="text-2xl font-bold">{widgets.length}</div>
          </div>
        </div>
      </section>

      {widgets.length === 0 ? (
        <div className="rounded-xl2 border border-white/10 bg-white/5 p-10 text-center text-white/65">
          No widgets registered for <b>{pageKey}</b>.
        </div>
      ) : (
        <section className="grid grid-cols-12 gap-4">
          {widgets.map((w) => (
            <div key={w.id} className="col-span-12 xl:col-span-6">
              <WidgetCard widget={w} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
