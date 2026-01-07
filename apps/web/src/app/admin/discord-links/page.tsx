import { DashboardShell } from "@/components/shell/DashboardShell";
import { DiscordLinkManager } from "@/components/admin/DiscordLinkManager";

export default function AdminDiscordLinksPage() {
  return (
    <DashboardShell
      title="Discord Linking"
      subtitle="Connect Discord users to CD2 users so audit + submissions show real names."
    >
      <DiscordLinkManager />
    </DashboardShell>
  );
}
