import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import {
  listProfissionaisAtivos,
  listServicosAtivosSimples,
} from "@/backend/services/agendamentoService";
import { ClienteAgendarView } from "@/frontend/components/cliente/ClienteAgendarView";
import { solicitarAgendamentoAction } from "./actions";

export default async function ClienteAgendarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/cliente/login");
  if (user.tipo !== "cliente") redirect("/dashboard");

  const [servicos, profissionais] = await Promise.all([
    listServicosAtivosSimples(),
    listProfissionaisAtivos(),
  ]);

  return (
    <ClienteAgendarView
      servicos={servicos}
      profissionais={profissionais}
      solicitarAction={solicitarAgendamentoAction}
    />
  );
}