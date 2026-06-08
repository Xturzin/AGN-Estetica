import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import {
  getPacienteDoUsuario,
  getProximoAgendamento,
} from "@/backend/services/clienteContextService";
import { listServicosAtivosSimples } from "@/backend/services/agendamentoService";
import { ClienteHomeView } from "@/frontend/components/cliente/ClienteHomeView";

export default async function ClienteHomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/cliente/login");
  if (user.tipo !== "cliente") redirect("/dashboard");

  const paciente = await getPacienteDoUsuario(user.id);
  if (!paciente) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "var(--ink-3)" }}>
        <h2>Conta não vinculada</h2>
        <p>Entre em contato com a clínica.</p>
      </div>
    );
  }

  const [proximo, servicos] = await Promise.all([
    getProximoAgendamento(paciente.id),
    listServicosAtivosSimples(),
  ]);

  return (
    <ClienteHomeView paciente={paciente} proximo={proximo} servicos={servicos} />
  );
}