import { redirect } from "next/navigation";
import { requirePageAccess } from "@/lib/routeAuth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  try {
    await requirePageAccess("/dashboard/cm");
  } catch {
    redirect("/dashboard/unauthorized?from=/dashboard/cm");
  }
  return <>{children}</>;
}
