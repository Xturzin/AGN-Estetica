import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { getDashboardCompleto } from "@/backend/services/dashboardService";
import { DashboardCompleto } from "@/frontend/components/clinica/DashboardCompleto";
import { aprovarDashboardAction, recusarDashboardAction } from "./actions";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  const data = await getDashboardCompleto();
  const primeiroNome = user.nome_completo?.split(" ")[0] ?? "";

  return (
    <DashboardCompleto
      data={data}
      primeiroNome={primeiroNome}
      aprovarAction={aprovarDashboardAction}
      recusarAction={recusarDashboardAction}
    />
  );
}