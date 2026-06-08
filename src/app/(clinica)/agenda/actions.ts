"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { requirePermission } from "@/backend/lib/auth/permissions";
import {
  createAgendamento,
  updateAgendamento,
  cancelarAgendamento,
  getAgendamento,
  type StatusAgendamento,
} from "@/backend/services/agendamentoService";
import { iniciarAtendimento } from "@/backend/services/atendimentoService";
import type { AgendamentoFormResult } from "@/frontend/components/clinica/AgendaSemanal";

const STATUS_VALIDOS: StatusAgendamento[] = [
  "agendado",
  "confirmado",
  "em_andamento",
  "concluido",
  "cancelado",
  "falta",
];

function parseCommon(formData: FormData): {
  paciente_id: string;
  profissional_id: string;
  servico_id: string;
  data_hora_inicio: string;
  duracao_minutos: number;
  observacoes: string | null;
} | { error: string } {
  const paciente_id = String(formData.get("paciente_id") ?? "").trim();
  const profissional_id = String(formData.get("profissional_id") ?? "").trim();
  const servico_id = String(formData.get("servico_id") ?? "").trim();
  const data_hora_inicio = String(formData.get("data_hora_inicio") ?? "").trim();
  const duracaoRaw = String(formData.get("duracao_minutos") ?? "").trim();
  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;

  if (!paciente_id) return { error: "Paciente é obrigatório." };
  if (!profissional_id) return { error: "Profissional é obrigatório." };
  if (!servico_id) return { error: "Serviço é obrigatório." };
  if (!data_hora_inicio) return { error: "Data/hora é obrigatória." };

  const duracao_minutos = parseInt(duracaoRaw, 10);
  if (isNaN(duracao_minutos) || duracao_minutos < 5) {
    return { error: "Duração inválida." };
  }

  return {
    paciente_id,
    profissional_id,
    servico_id,
    data_hora_inicio,
    duracao_minutos,
    observacoes,
  };
}

export async function createAgendamentoAction(
  formData: FormData
): Promise<AgendamentoFormResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Não autenticado." };
  if (user.tipo === "cliente") return { error: "Sem permissão." };

  const parsed = parseCommon(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await createAgendamento({
    ...parsed,
    criado_por: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/agenda");
  return { success: "Agendamento criado." };
}

export async function updateAgendamentoAction(
  formData: FormData
): Promise<AgendamentoFormResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Não autenticado." };
  if (user.tipo === "cliente") return { error: "Sem permissão." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID ausente." };

  const parsed = parseCommon(formData);
  if ("error" in parsed) return { error: parsed.error };

  const statusRaw = String(formData.get("status") ?? "").trim();
  const status = STATUS_VALIDOS.includes(statusRaw as StatusAgendamento)
    ? (statusRaw as StatusAgendamento)
    : undefined;

  const { error } = await updateAgendamento(id, {
    ...parsed,
    status,
  });

  if (error) return { error: error.message };

  revalidatePath("/agenda");
  return { success: "Agendamento atualizado." };
}

export async function cancelarAgendamentoAction(
  formData: FormData
): Promise<AgendamentoFormResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Não autenticado." };
  if (user.tipo === "cliente") return { error: "Sem permissão." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID ausente." };

  const { error } = await cancelarAgendamento(id);
  if (error) return { error: error.message };

  revalidatePath("/agenda");
  return { success: "Agendamento cancelado." };
}

export async function iniciarAtendimentoFromAgendaAction(
  formData: FormData
): Promise<AgendamentoFormResult> {
  await requirePermission("iniciar_atendimento");

  const agendamentoId = String(formData.get("id") ?? "").trim();
  if (!agendamentoId) return { error: "ID ausente." };

  const ag = await getAgendamento(agendamentoId);
  if (!ag) return { error: "Agendamento não encontrado." };

  const { data, error } = await iniciarAtendimento({
    paciente_id: ag.paciente_id,
    profissional_id: ag.profissional_id,
    servico_id: ag.servico_id,
    agendamento_id: ag.id,
  });

  if (error || !data) return { error: error?.message ?? "Erro." };

  revalidatePath("/agenda");
  redirect(`/atendimento/${data.id}`);
}