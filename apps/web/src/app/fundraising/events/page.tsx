import { PageShell } from "@/components/shell/PageShell";
import { RegistryPage } from "@/modules/registry/RegistryPage";

export default function FundraisingEventsPage() {
  return (
    <PageShell title="Events" subtitle="Invites → confirmations → attendance → dollars.">
      <RegistryPage pageKey="fundraising.events" />
    </PageShell>
  );
}
