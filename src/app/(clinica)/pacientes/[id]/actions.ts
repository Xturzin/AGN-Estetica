"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/backend/lib/auth/permissions";
import {
  createEvolucao,
  updateEvolucao,
  type EvolucaoInsert,
  type TipoEvolucao,
} from "@/backend/services/evolucaoService";
import type { EvolucaoFormResult } from "@/frontend/components/clinica/EvolucaoTimeline";

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