import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { Historico } from "@/frontend/components/screens/cliente/Historico";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/cliente/login");
  return <Historico />;
}