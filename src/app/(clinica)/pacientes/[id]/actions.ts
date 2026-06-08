"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/backend/lib/auth/permissions";
import {
  createEvolucao,
  updateEvolucao,
  type EvolucaoInsert,
  type TipoEvolucao,
} from "@/backend/services/evolucaoService";
import {
  uploadFoto,
  type TipoFoto,
} from "@/backend/services/fotoClinicaService";
import {
  uploadDocumento,
  type TipoDocumento,
} from "@/backend/services/documentoService";
import type { EvolucaoFormResult } from "@/frontend/components/clinica/EvolucaoTimeline";
import type { FotoUploadResult } from "@/frontend/components/clinica/FotoGallery";
import type { DocumentoUploadResult } from "@/frontend/components/clinica/DocumentoList";

const TIPOS_VALIDOS: TipoEvolucao[] = [
  "consulta",
  "avaliacao",
  "procedimento",
  "observacao",
  "retorno",
  "exame",
];

function parseForm(
  formData: FormData
):
  | Omit<EvolucaoInsert, "paciente_id" | "profissional_id">
  | { error: string } {
  const tipo = String(formData.get("tipo") ?? "") as TipoEvolucao;
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim() || null;
  const dataHoraRaw = String(formData.get("data_hora") ?? "").trim();

  if (!TIPOS_VALIDOS.includes(tipo)) return { error: "Tipo inválido." };
  if (!titulo) return { error: "Título é obrigatório." };
  if (!dataHoraRaw) return { error: "Data/hora é obrigatória." };

  const date = new Date(dataHoraRaw);
  if (isNaN(date.getTime())) return { error: "Data/hora inválida." };

  return {
    tipo,
    titulo,
    descricao,
    data_hora: date.toISOString(),
  };
}

export async function createEvolucaoAction(
  pacienteId: string,
  formData: FormData
): Promise<EvolucaoFormResult> {
  const user = await requirePermission("editar_prontuario");

  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await createEvolucao({
    ...parsed,
    paciente_id: pacienteId,
    profissional_id: user.id,
  });

  if (error) return { error: `Erro ao criar: ${error.message}` };

  revalidatePath(`/pacientes/${pacienteId}`);
  return { success: "Evolução registrada." };
}

export async function updateEvolucaoAction(
  pacienteId: string,
  formData: FormData
): Promise<EvolucaoFormResult> {
  await requirePermission("editar_prontuario");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID ausente." };

  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await updateEvolucao(id, parsed);
  if (error) return { error: `Erro ao atualizar: ${error.message}` };

  revalidatePath(`/pacientes/${pacienteId}`);
  return { success: "Evolução atualizada." };
}

// ===== Foto clínica =====

const TIPOS_FOTO_VALIDOS: TipoFoto[] = ["antes", "durante", "depois"];

export async function uploadFotoAction(
  pacienteId: string,
  formData: FormData
): Promise<FotoUploadResult> {
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
    tipo,
    descricao,
    enviado_por: user.id,
    fileBuffer: buffer,
    contentType: file.type || "image/webp",
    fileExt: ext,
  });

  if (error) return { error: `Erro ao enviar: ${error.message}` };

  revalidatePath(`/pacientes/${pacienteId}`);
  return { success: "Foto enviada." };
}

// ===== Documento =====

const TIPOS_DOC_VALIDOS: TipoDocumento[] = [
  "termo_consentimento",
  "exame",
  "receita",
  "outro",
];

export async function uploadDocumentoAction(
  pacienteId: string,
  formData: FormData
): Promise<DocumentoUploadResult> {
  const user = await requirePermission("editar_prontuario");

  const tipo = String(formData.get("tipo") ?? "") as TipoDocumento;
  const nome = String(formData.get("nome") ?? "").trim();
  const file = formData.get("file");

  if (!TIPOS_DOC_VALIDOS.includes(tipo)) return { error: "Tipo inválido." };
  if (!nome) return { error: "Nome é obrigatório." };
  if (!(file instanceof File)) return { error: "Arquivo ausente." };

  const buffer = await file.arrayBuffer();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";

  const { error } = await uploadDocumento({
    paciente_id: pacienteId,
    tipo,
    nome,
    enviado_por: user.id,
    fileBuffer: buffer,
    contentType: file.type || "application/octet-stream",
    fileSize: file.size,
    fileExt: ext,
  });

  if (error) return { error: `Erro ao enviar: ${error.message}` };

  revalidatePath(`/pacientes/${pacienteId}`);
  return { success: "Documento enviado." };
}