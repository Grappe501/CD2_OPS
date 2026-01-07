import { DashboardShell } from "@/components/shell/DashboardShell";
import { QuickAddFab } from "@/components/quickAdd/QuickAddFab";

export default function CadenceDashboardPage() {
  return (
    <DashboardShell title="Cadence" subtitle="Commitments, due dates, and operational discipline.">
      <div className="mt-4">
        <div className="text-white/70 text-sm">Widgets render below via registry.</div>
      </div>
      <QuickAddFab defaultMode="cadence" />
    </DashboardShell>
  );
}
