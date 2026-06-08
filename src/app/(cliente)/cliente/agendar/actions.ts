"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { getPacienteDoUsuario } from "@/backend/services/clienteContextService";
import {
  criarSolicitacaoAgendamento,
  listUsuariosQueAprovam,
} from "@/backend/services/aprovacaoService";
import { listServicosAtivosSimples } from "@/backend/services/agendamentoService";
import { criarNotificacao } from "@/backend/services/notificacaoService";
import { emailSolicitacaoRecebida } from "@/backend/services/emailService";

export async function solicitarAgendamentoAction(
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Não autenticado." };
  if (user.tipo !== "cliente") return { error: "Sem permissão." };

  const paciente = await getPacienteDoUsuario(user.id);
  if (!paciente) return { error: "Paciente não vinculado." };

  const servico_id = String(formData.get("servico_id") ?? "").trim();
  const profissional_id = String(formData.get("profissional_id") ?? "").trim();
  const data = String(formData.get("data") ?? "").trim();
  const hora = String(formData.get("hora") ?? "").trim();
  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;

  if (!servico_id) return { error: "Selecione um serviço." };
  if (!profissional_id) return { error: "Selecione um profissional." };
  if (!data || !hora) return { error: "Informe data e horário." };

  const dataHora = new Date(`${data}T${hora}:00`);
  if (isNaN(dataHora.getTime())) return { error: "Data/hora inválida." };
  if (dataHora.getTime() < Date.now()) return { error: "Escolha um horário futuro." };

  const servicos = await listServicosAtivosSimples();
  const servico = servicos.find((s) => s.id === servico_id);
  if (!servico) return { error: "Serviço inválido." };

  const { data: aprovacao, error } = await criarSolicitacaoAgendamento({
    solicitante_id: user.id,
    paciente_id: paciente.id,
    profissional_id,
    servico_id,
    servico_nome: servico.nome,
    data_hora_preferida: dataHora.toISOString(),
    duracao_minutos: servico.duracao_minutos,
    observacoes,
  });

  if (error || !aprovacao) return { error: error?.message ?? "Erro." };

  // Notificações internas + emails pra equipe
  const equipe = await listUsuariosQueAprovam();
  for (const u of equipe) {
    await criarNotificacao({
      usuario_id: u.id,
      tipo: "nova_solicitacao",
      titulo: "Nova solicitação de agendamento",
      corpo: `${paciente.nome_completo} pediu ${servico.nome}.`,
      dados: { aprovacao_id: aprovacao.id },
    });
  }

  // Email pra equipe (não bloqueia se falhar)
  await emailSolicitacaoRecebida({
    destinatarios: equipe.map((u) => u.email).filter((e): e is string => !!e),
    paciente_nome: paciente.nome_completo,
    servico_nome: servico.nome,
    data_hora: dataHora,
    observacoes,
  });

  revalidatePath("/aprovacoes");
  return { success: "Solicitação enviada." };
}