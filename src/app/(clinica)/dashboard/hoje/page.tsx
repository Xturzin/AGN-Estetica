import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { getDashboardHoje } from "@/backend/services/dashboardService";
import { DashboardHoje } from "@/frontend/components/clinica/DashboardHoje";

export default async function DashboardHojePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  const data = await getDashboardHoje();
  const primeiroNome = user.nome_completo?.split(" ")[0] ?? "";

  return <DashboardHoje data={data} primeiroNome={primeiroNome} />;
}