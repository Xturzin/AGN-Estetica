"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/backend/lib/auth/permissions";
import {
  getClinica,
  updateClinica,
  type ClinicaUpdate,
} from "@/backend/services/clinicaService";
import type { ClinicaFormResult } from "@/frontend/components/clinica/ClinicaForm";

export async function updateClinicaAction(
  _prev: ClinicaFormResult,
  formData: FormData
): Promise<ClinicaFormResult> {
  // Defesa em profundidade: actions são endpoints públicos
  await requirePermission("editar_configuracoes");

  const clinica = await getClinica();
  if (!clinica) {
    return { error: "Clínica não encontrada." };
  }

  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) {
    return { error: "Nome da clínica é obrigatório." };
  }

  const horarioTexto = String(formData.get("horario_texto") ?? "").trim();

  const patch: ClinicaUpdate = {
    nome,
    cnpj: String(formData.get("cnpj") ?? "").trim() || null,
    telefone: String(formData.get("telefone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    cep: String(formData.get("cep") ?? "").trim() || null,
    endereco: String(formData.get("endereco") ?? "").trim() || null,
    logo_url: String(formData.get("logo_url") ?? "").trim() || null,
    horario_funcionamento: horarioTexto ? { texto: horarioTexto } : null,
  };

  const { error } = await updateClinica(clinica.id, patch);

  if (error) {
    return { error: `Erro ao salvar: ${error.message}` };
  }

  revalidatePath("/configuracoes");
  return { success: "Configurações salvas com sucesso." };
}