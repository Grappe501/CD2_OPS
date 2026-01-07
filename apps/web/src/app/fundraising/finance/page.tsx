import { PageShell } from "@/components/shell/PageShell";
import { RegistryPage } from "@/modules/registry/RegistryPage";

export default function FundraisingFinancePage() {
  return (
    <PageShell title="Finance Dashboard" subtitle="Pipeline health, lane performance, and pledge discipline.">
      <RegistryPage pageKey="fundraising.finance" />
    </PageShell>
  );
}
