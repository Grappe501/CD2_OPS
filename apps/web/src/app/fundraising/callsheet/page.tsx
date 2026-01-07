import { PageShell } from "@/components/shell/PageShell";
import { CallSheet } from "@/modules/fundraising/callsheet/CallSheet";

export default function CallSheetPage() {
  return (
    <PageShell title="Call Sheet" subtitle="Printable list for call blocks.">
      <CallSheet />
    </PageShell>
  );
}
