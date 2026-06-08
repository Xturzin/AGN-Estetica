import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { userHasPermission } from "@/backend/lib/auth/permissions";
import { getPaciente } from "@/backend/services/pacienteService";
import { listEvolucoesPaciente } from "@/backend/services/evolucaoService";
import { listFotosPaciente } from "@/backend/services/fotoClinicaService";
import { listDocumentosPaciente } from "@/backend/services/documentoService";
import { PacienteHeader } from "@/frontend/components/clinica/PacienteHeader";
import { PacienteTabs } from "@/frontend/components/clinica/PacienteTabs";
import {
  createEvolucaoAction,
  updateEvolucaoAction,
  uploadFotoAction,
  uploadDocumentoAction,
} from "./actions";

interface PageProps {
  params: { id: string };
}

export default async function PacientePerfilPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  const paciente = await getPaciente(params.id);
  if (!paciente) notFound();

  const [evolucoes, fotos, documentos, canEditProntuario] = await Promise.all([
    listEvolucoesPaciente(params.id),
    listFotosPaciente(params.id),
    listDocumentosPaciente(params.id),
    userHasPermission(user, "editar_prontuario"),
  ]);

  const createEvolucaoBound = createEvolucaoAction.bind(null, params.id);
  const updateEvolucaoBound = updateEvolucaoAction.bind(null, params.id);
  const uploadFotoBound = uploadFotoAction.bind(null, params.id);
  const uploadDocumentoBound = uploadDocumentoAction.bind(null, params.id);

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
        fotos={fotos}
        documentos={documentos}
        canEditProntuario={canEditProntuario}
        createEvolucaoAction={createEvolucaoBound}
        updateEvolucaoAction={updateEvolucaoBound}
        uploadFotoAction={uploadFotoBound}
        uploadDocumentoAction={uploadDocumentoBound}
      />
    </div>
  );
}