import { redirect } from "next/navigation";
import { requirePageAccess } from "@/lib/routeAuth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  try {
    await requirePageAccess("/dashboard/data-entry/risks");
  } catch {
    redirect("/dashboard/unauthorized?from=/dashboard/data-entry/risks");
  }
  return <>{children}</>;
}
