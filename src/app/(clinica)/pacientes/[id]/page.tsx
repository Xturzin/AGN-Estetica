import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { userHasPermission } from "@/backend/lib/auth/permissions";
import { getPaciente } from "@/backend/services/pacienteService";
import { listEvolucoesPaciente } from "@/backend/services/evolucaoService";
import { PacienteHeader } from "@/frontend/components/clinica/PacienteHeader";
import { PacienteTabs } from "@/frontend/components/clinica/PacienteTabs";
import { createEvolucaoAction, updateEvolucaoAction } from "./actions";

interface PageProps {
  params: { id: string };
}

export default async function PacientePerfilPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  const paciente = await getPaciente(params.id);
  if (!paciente) notFound();

  const [evolucoes, canEditProntuario] = await Promise.all([
    listEvolucoesPaciente(params.id),
    userHasPermission(user, "editar_prontuario"),
  ]);

  const createAction = createEvolucaoAction.bind(null, params.id);
  const updateAction = updateEvolucaoAction.bind(null, params.id);

  return (
    <div
      style={{
        padding: "32px clamp(20px, 4vw, 48px)",
        maxWidth: 1120,
        margin: "0 auto",
      }}
    >
      <PacienteHeader paciente={paciente} />
      <PacienteTabs
        paciente={paciente}
        evolucoes={evolucoes}
        canEditProntuario={canEditProntuario}
        createEvolucaoAction={createAction}
        updateEvolucaoAction={updateAction}
      />
    </div>
  );
}