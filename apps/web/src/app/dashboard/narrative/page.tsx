import { DashboardShell } from "@/components/shell/DashboardShell";
import { QuickAddFab } from "@/components/quickAdd/QuickAddFab";

export default function NarrativeDashboardPage() {
  return (
    <DashboardShell title="Narrative & Trust" subtitle="What voters are hearing, asking, and misunderstanding.">
      <div className="mt-4">
        <div className="text-white/70 text-sm">Widgets render below via registry.</div>
      </div>
      <QuickAddFab defaultMode="question" />
    </DashboardShell>
  );
}
