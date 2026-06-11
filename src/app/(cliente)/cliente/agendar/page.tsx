import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { Agendamento } from "@/frontend/components/screens/cliente/Agendamento";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/cliente/login");
  return <Agendamento />;
}