import { PageShell } from "@/components/shell/PageShell";
import { RegistryPage } from "@/modules/registry/RegistryPage";

export default function FundraisingCandidatePage() {
  return (
    <PageShell title="Candidate Call Time" subtitle="Simple, high-signal view of your call time output.">
      <RegistryPage pageKey="fundraising.candidate" />
    </PageShell>
  );
}
