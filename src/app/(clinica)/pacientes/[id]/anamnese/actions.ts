"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/backend/lib/auth/permissions";
import { upsertAnamnese } from "@/backend/services/anamneseService";
import type { AnamneseSaveResult } from "@/frontend/lib/form-types";

const SECOES_VALIDAS = [
  "dados_gerais",
  "saude",
  "habitos",
  "contraindicacoes",
] as const;
type SecaoValida = (typeof SECOES_VALIDAS)[number];

export async function saveAnamneseAction(
  pacienteId: string,
  formData: FormData
): Promise<AnamneseSaveResult> {
  const user = await requirePermission("editar_prontuario");

  const secao = String(formData.get("secao") ?? "");
  const dadosRaw = String(formData.get("dados") ?? "{}");

  if (!SECOES_VALIDAS.includes(secao as SecaoValida)) {
    return { error: "Seção inválida." };
  }

  let dados: Record<string, unknown>;
  try {
    dados = JSON.parse(dadosRaw);
  } catch {
    return { error: "Dados inválidos (JSON corrompido)." };
  }

  const params: Parameters<typeof upsertAnamnese>[0] = {
    paciente_id: pacienteId,
    atualizada_por: user.id,
  };

  if (secao === "dados_gerais") params.dados_gerais = dados;
  else if (secao === "saude") params.saude = dados;
  else if (secao === "habitos") params.habitos = dados;
  else if (secao === "contraindicacoes") params.contraindicacoes = dados;

  const { error } = await upsertAnamnese(params);
  if (error) return { error: `Erro ao salvar: ${error.message}` };

  revalidatePath(`/pacientes/${pacienteId}`);
  revalidatePath(`/pacientes/${pacienteId}/anamnese`);
  return { success: "Seção salva." };
}