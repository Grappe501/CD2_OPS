import { redirect } from "next/navigation";
import { requirePageRole } from "@/lib/routeAuth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  try {
    await requirePageRole(["admin"]);
  } catch {
    redirect("/dashboard/unauthorized?from=/dashboard/admin&hint=admin_only");
  }
  return <>{children}</>;
}
