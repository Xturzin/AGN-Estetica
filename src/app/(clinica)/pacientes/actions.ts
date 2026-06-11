"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import {
  createPaciente,
  updatePaciente,
  setPacienteAtivo,
  type PacienteInsert,
} from "@/backend/services/pacienteService";
import type { PacienteFormResult } from "@/frontend/lib/form-types";

async function requireClinicTeam() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");
  return user;
}

function parseForm(formData: FormData): PacienteInsert | { error: string } {
  const nome_completo = String(formData.get("nome_completo") ?? "").trim();
  if (!nome_completo) return { error: "Nome é obrigatório." };

  return {
    nome_completo,
    data_nascimento: String(formData.get("data_nascimento") ?? "").trim() || null,
    cpf: String(formData.get("cpf") ?? "").trim() || null,
    telefone: String(formData.get("telefone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim().toLowerCase() || null,
    cep: String(formData.get("cep") ?? "").trim() || null,
    logradouro: String(formData.get("logradouro") ?? "").trim() || null,
    bairro: String(formData.get("bairro") ?? "").trim() || null,
    cidade: String(formData.get("cidade") ?? "").trim() || null,
    estado: String(formData.get("estado") ?? "").trim().toUpperCase() || null,
    ativo: true,
  };
}

export async function createPacienteAction(
  formData: FormData
): Promise<PacienteFormResult> {
  const user = await requireClinicTeam();

  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await createPaciente({
    ...parsed,
    cadastrado_por: user.id,
  });
  if (error) return { error: `Erro ao criar: ${error.message}` };

  revalidatePath("/pacientes");
  return { success: "Paciente cadastrado." };
}

export async function updatePacienteAction(
  formData: FormData
): Promise<PacienteFormResult> {
  await requireClinicTeam();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID ausente." };

  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  // Patch sem ativo (toggle é separado) e sem cadastrado_por (não muda)
  const patch = {
    nome_completo: parsed.nome_completo,
    data_nascimento: parsed.data_nascimento,
    cpf: parsed.cpf,
    telefone: parsed.telefone,
    email: parsed.email,
    cep: parsed.cep,
    logradouro: parsed.logradouro,
    bairro: parsed.bairro,
    cidade: parsed.cidade,
    estado: parsed.estado,
  };

  const { error } = await updatePaciente(id, patch);
  if (error) return { error: `Erro ao atualizar: ${error.message}` };

  revalidatePath("/pacientes");
  return { success: "Paciente atualizado." };
}

export async function toggleAtivoPacienteAction(
  formData: FormData
): Promise<PacienteFormResult> {
  await requireClinicTeam();

  const id = String(formData.get("id") ?? "").trim();
  const ativo = String(formData.get("ativo") ?? "") === "true";
  if (!id) return { error: "ID ausente." };

  const { error } = await setPacienteAtivo(id, ativo);
  if (error) return { error: error.message };

  revalidatePath("/pacientes");
  return { success: ativo ? "Paciente reativado." : "Paciente desativado." };
}