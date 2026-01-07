import { DashboardShell } from "@/components/shell/DashboardShell";
import { QuickAddFab } from "@/components/quickAdd/QuickAddFab";

export default function CmDashboardPage() {
  return (
    <DashboardShell title="CM Operating Board" subtitle="Scorecard, decisions, risks, cadence, and stop-doing in one place.">
      {/* Existing widget renderer should already populate widgets based on registry */}
      <div className="mt-4">
        <div className="text-white/70 text-sm">Widgets render below via registry.</div>
      </div>
      <QuickAddFab defaultMode="cadence" />
    </DashboardShell>
  );
}
