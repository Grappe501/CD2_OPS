import { NavShell } from "@/components/nav/NavShell";
import { Topbar } from "@/components/topbar/Topbar";
import { getSessionFromCookies } from "@/lib/auth";
import type { Role } from "@cd2/core";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromCookies();
  const role = (session?.role ?? "cm") as Role;

  return (
    <NavShell role={role}>
      <Topbar />
      <div className="p-5 lg:p-8">
        {children}
      </div>
    </NavShell>
  );
}
