import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { requirePermission } from "@/backend/lib/auth/permissions";
import { getAtendimentoComRefs } from "@/backend/services/atendimentoService";
import { listEvolucoesPaciente } from "@/backend/services/evolucaoService";
import { listFotosPaciente } from "@/backend/services/fotoClinicaService";
import { AtendimentoAtivo } from "@/frontend/components/clinica/AtendimentoAtivo";
import { getAnamnese } from "@/backend/services/anamneseService";
import {
  createEvolucaoNoAtendimentoAction,
  uploadFotoNoAtendimentoAction,
  finalizarAtendimentoAction,
  cancelarAtendimentoAction,
} from "./actions";

interface PageProps {
  params: { id: string };
}

export default async function AtendimentoPage({ params }: PageProps) {
  await requirePermission("iniciar_atendimento");
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const atendimento = await getAtendimentoComRefs(params.id);
  if (!atendimento) notFound();
  const anamnese = await getAnamnese(atendimento.paciente_id);

  const [todasEvolucoes, todasFotos] = await Promise.all([
    listEvolucoesPaciente(atendimento.paciente_id),
    listFotosPaciente(atendimento.paciente_id),
  ]);

  const evolucoesDesteAtendimento = todasEvolucoes.filter(
    (e) => e.atendimento_id === atendimento.id
  );
  const fotosDesteAtendimento = todasFotos.filter(
    (f) => f.atendimento_id === atendimento.id
  );

  const createEvolucaoBound = createEvolucaoNoAtendimentoAction.bind(
    null,
    atendimento.paciente_id
  );
  const uploadFotoBound = uploadFotoNoAtendimentoAction.bind(
    null,
    atendimento.paciente_id,
    atendimento.id
  );
  const finalizarBound = finalizarAtendimentoAction.bind(null, atendimento.id);
  const cancelarBound = cancelarAtendimentoAction.bind(null, atendimento.id);

  return (
    <div style={{ padding: "32px clamp(20px, 4vw, 48px)", maxWidth: 1000, margin: "0 auto" }}>
      <AtendimentoAtivo
      atendimento={atendimento}
      anamnese={anamnese}
        evolucoes={evolucoesDesteAtendimento}
        fotos={fotosDesteAtendimento}
        createEvolucaoAction={createEvolucaoBound}
        uploadFotoAction={uploadFotoBound}
        finalizarAction={finalizarBound}
        cancelarAction={cancelarBound}
      />
    </div>
  );
}