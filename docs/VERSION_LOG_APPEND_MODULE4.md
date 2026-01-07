## CD2_OPS v0.5.0 — Module 4 (Real Widgets + Formatting)
- Added strict metric formatting utilities (`apps/web/src/lib/format.ts`)
- Added metric catalog for UI display consistency (`apps/web/src/lib/metricCatalog.ts`)
- Added widget UI primitives:
  - WidgetFrame, WidgetStates, MetricPill, KpiTiles, DataTable, LineChart
- Added view adapters in `apps/web/src/components/widgets/renderers.tsx`
- Updated WidgetCard to render real components with premium states

Checklist:
- [ ] Merge files
- [ ] Install deps (echarts, echarts-for-react)
- [ ] Verify `/dashboard/candidate` renders KPI tiles from real view
- [ ] Verify table widgets render correctly
