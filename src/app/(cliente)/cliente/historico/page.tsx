import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import {
  getPacienteDoUsuario,
  getProximoAgendamento,
} from "@/backend/services/clienteContextService";
import { listEvolucoesPaciente } from "@/backend/services/evolucaoService";
import { listFotosPaciente } from "@/backend/services/fotoClinicaService";
import { ClienteHistoricoView } from "@/frontend/components/cliente/ClienteHistoricoView";

export default async function ClienteHistoricoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/cliente/login");
  if (user.tipo !== "cliente") redirect("/dashboard");

  const paciente = await getPacienteDoUsuario(user.id);
  if (!paciente) redirect("/cliente/home");

  const [evolucoes, fotos, proximo] = await Promise.all([
    listEvolucoesPaciente(paciente.id),
    listFotosPaciente(paciente.id),
    getProximoAgendamento(paciente.id),
  ]);

  return (
    <ClienteHistoricoView
      evolucoes={evolucoes}
      fotos={fotos}
      clienteDesde={paciente.created_at}
      proximaData={proximo?.data_hora_inicio ?? null}
    />
  );
}