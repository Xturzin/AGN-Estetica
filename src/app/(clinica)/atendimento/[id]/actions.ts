"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/backend/lib/auth/permissions";
import { createEvolucao, type TipoEvolucao } from "@/backend/services/evolucaoService";
import { uploadFoto, type TipoFoto } from "@/backend/services/fotoClinicaService";
import { finalizarAtendimento, cancelarAtendimento } from "@/backend/services/atendimentoService";

const TIPOS_EVOLUCAO_VALIDOS: TipoEvolucao[] = [
  "consulta", "avaliacao", "procedimento", "observacao", "retorno", "exame",
];

export async function createEvolucaoNoAtendimentoAction(
  pacienteId: string,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const user = await requirePermission("editar_prontuario");

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const tipoRaw = String(formData.get("tipo") ?? "");
  const dataHora = String(formData.get("data_hora") ?? "").trim();
  const atendimentoId = String(formData.get("atendimento_id") ?? "").trim() || null;

  if (!titulo) return { error: "Título é obrigatório." };
  if (!TIPOS_EVOLUCAO_VALIDOS.includes(tipoRaw as TipoEvolucao)) {
    return { error: "Tipo inválido." };
  }
  if (!dataHora) return { error: "Data/hora ausente." };

  const { error } = await createEvolucao({
    paciente_id: pacienteId,
    atendimento_id: atendimentoId,
    profissional_id: user.id,
    tipo: tipoRaw as TipoEvolucao,
    titulo,
    descricao,
    data_hora: dataHora,
  });

  if (error) return { error: `Erro: ${error.message}` };

  revalidatePath(`/atendimento/${atendimentoId ?? ""}`);
  revalidatePath(`/pacientes/${pacienteId}`);
  return { success: "Evolução adicionada." };
}

const TIPOS_FOTO_VALIDOS: TipoFoto[] = ["antes", "durante", "depois"];

export async function uploadFotoNoAtendimentoAction(
  pacienteId: string,
  atendimentoId: string,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const user = await requirePermission("editar_prontuario");

  const tipo = String(formData.get("tipo") ?? "") as TipoFoto;
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const file = formData.get("file");

  if (!TIPOS_FOTO_VALIDOS.includes(tipo)) return { error: "Tipo inválido." };
  if (!(file instanceof File)) return { error: "Arquivo ausente." };

  const buffer = await file.arrayBuffer();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "webp";

  const { error } = await uploadFoto({
    paciente_id: pacienteId,
    atendimento_id: atendimentoId,
    tipo,
    descricao,
    enviado_por: user.id,
    fileBuffer: buffer,
    contentType: file.type || "image/webp",
    fileExt: ext,
  });

  if (error) return { error: `Erro ao enviar: ${error.message}` };

  revalidatePath(`/atendimento/${atendimentoId}`);
  revalidatePath(`/pacientes/${pacienteId}`);
  return { success: "Foto enviada." };
}

export async function finalizarAtendimentoAction(
  atendimentoId: string,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  await requirePermission("iniciar_atendimento");

  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;

  const { data, error } = await finalizarAtendimento(atendimentoId, { observacoes });
  if (error || !data) return { error: error?.message ?? "Erro." };

  revalidatePath(`/pacientes/${data.paciente_id}`);
  revalidatePath("/agenda");
  redirect(`/pacientes/${data.paciente_id}`);
}

export async function cancelarAtendimentoAction(
  atendimentoId: string
): Promise<{ error?: string; success?: string }> {
  await requirePermission("iniciar_atendimento");

  const { error } = await cancelarAtendimento(atendimentoId);
  if (error) return { error: error.message };

  revalidatePath("/agenda");
  redirect("/agenda");
}