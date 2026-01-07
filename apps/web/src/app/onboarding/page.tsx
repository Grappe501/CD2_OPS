import { DashboardShell } from "@/components/shell/DashboardShell";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default function OnboardingPage() {
  return (
    <DashboardShell
      title="Welcome to CD2_OPS"
      subtitle="This takes 3 minutes. You’ll know exactly what to do and how to do it."
    >
      <OnboardingWizard />
    </DashboardShell>
  );
}
