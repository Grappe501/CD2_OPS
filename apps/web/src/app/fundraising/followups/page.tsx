import { PageShell } from "@/components/shell/PageShell";
import { RegistryPage } from "@/modules/registry/RegistryPage";

export default function FundraisingFollowupsPage() {
  return (
    <PageShell title="Follow-ups" subtitle="Where money is won or lost. Keep this clean.">
      <RegistryPage pageKey="fundraising.followups" />
    </PageShell>
  );
}
