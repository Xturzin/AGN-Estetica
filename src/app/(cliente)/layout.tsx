import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/cliente/login");
  if (user.tipo !== "cliente") redirect("/dashboard");
  return <>{children}</>;
}