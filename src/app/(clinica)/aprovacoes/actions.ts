"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/backend/lib/auth/permissions";
import { getAprovacao, resolverAprovacao } from "@/backend/services/aprovacaoService";
import { createAgendamento } from "@/backend/services/agendamentoService";
import { criarNotificacao } from "@/backend/services/notificacaoService";
import type { AprovacaoActionResult } from "@/frontend/components/clinica/AprovacaoList";

export async function aprovarAction(formData: FormData): Promise<AprovacaoActionResult> {
  const user = await requirePermission("aprovar_solicitacoes");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID ausente." };

  const aprovacao = await getAprovacao(id);
  if (!aprovacao) return { error: "Aprovação não encontrada." };
  if (aprovacao.status !== "pendente") return { error: "Aprovação já resolvida." };

  let agendamentoId: string | null = null;

  if (aprovacao.tipo === "solicitacao_agendamento") {
    const d = (aprovacao.dados ?? {}) as Record<string, unknown>;
    const paciente_id = String(d.paciente_id ?? "");
    const profissional_id = String(d.profissional_id ?? "");
    const servico_id = String(d.servico_id ?? "");
    const data_hora_inicio = String(d.data_hora_preferida ?? d.data_hora ?? "");
    const duracao_minutos = typeof d.duracao_minutos === "number" ? d.duracao_minutos : 30;

    if (!paciente_id || !profissional_id || !servico_id || !data_hora_inicio) {
      return { error: "Dados da solicitação incompletos." };
    }

    const { data: ag, error: agErr } = await createAgendamento({
      paciente_id,
      profissional_id,
      servico_id,
      data_hora_inicio,
      duracao_minutos,
      observacoes: typeof d.observacoes === "string" ? d.observacoes : null,
      criado_por: user.id,
    });

    if (agErr || !ag) return { error: agErr?.message ?? "Erro ao criar agendamento." };
    agendamentoId = ag.id;
  }

  const { error } = await resolverAprovacao(id, "aprovado", user.id, agendamentoId);
  if (error) return { error: error.message };

  await criarNotificacao({
    usuario_id: aprovacao.solicitante_id,
    tipo: "agendamento_confirmado",
    titulo: "Solicitação aprovada",
    corpo: "Sua solicitação foi aprovada pela clínica.",
    dados: { aprovacao_id: id, agendamento_id: agendamentoId },
  });

  revalidatePath("/aprovacoes");
  revalidatePath("/agenda");
  return { success: "Aprovado." };
}

export async function recusarAction(formData: FormData): Promise<AprovacaoActionResult> {
  const user = await requirePermission("aprovar_solicitacoes");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID ausente." };

  const aprovacao = await getAprovacao(id);
  if (!aprovacao) return { error: "Aprovação não encontrada." };
  if (aprovacao.status !== "pendente") return { error: "Aprovação já resolvida." };

  const { error } = await resolverAprovacao(id, "recusado", user.id, null);
  if (error) return { error: error.message };

  await criarNotificacao({
    usuario_id: aprovacao.solicitante_id,
    tipo: "agendamento_cancelado",
    titulo: "Solicitação recusada",
    corpo: "Sua solicitação não pôde ser atendida pela clínica.",
    dados: { aprovacao_id: id },
  });

  revalidatePath("/aprovacoes");
  return { success: "Recusada." };
}