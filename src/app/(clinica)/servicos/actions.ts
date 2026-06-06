"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/backend/lib/auth/permissions";
import {
  createServico,
  updateServico,
  setServicoAtivo,
  type ServicoInsert,
  type ServicoUpdate,
} from "@/backend/services/servicoService";
import type { ServicoFormResult } from "@/frontend/components/clinica/ServicoList";

function parseForm(formData: FormData): ServicoInsert | { error: string } {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return { error: "Nome é obrigatório." };

  const duracao = parseInt(String(formData.get("duracao_minutos") ?? ""), 10);
  if (isNaN(duracao) || duracao < 5) {
    return { error: "Duração deve ser de pelo menos 5 minutos." };
  }

  const preco = parseFloat(String(formData.get("preco") ?? ""));
  if (isNaN(preco) || preco < 0) {
    return { error: "Preço inválido." };
  }

  return {
    nome,
    descricao: String(formData.get("descricao") ?? "").trim() || null,
    duracao_minutos: duracao,
    preco,
    categoria: String(formData.get("categoria") ?? "").trim() || null,
    cor: String(formData.get("cor") ?? "").trim() || null,
    ativo: true,
  };
}

export async function createServicoAction(
  formData: FormData
): Promise<ServicoFormResult> {
  await requirePermission("gerenciar_servicos");

  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { error } = await createServico(parsed);
  if (error) return { error: `Erro ao criar: ${error.message}` };

  revalidatePath("/servicos");
  return { success: "Serviço criado." };
}

export async function updateServicoAction(
  formData: FormData
): Promise<ServicoFormResult> {
  await requirePermission("gerenciar_servicos");

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID do serviço ausente." };

  const parsed = parseForm(formData);
  if ("error" in parsed) return { error: parsed.error };

  // Não mexer em ativo no form de edição (toggle é separado)
  const patch: ServicoUpdate = {
    nome: parsed.nome,
    descricao: parsed.descricao,
    duracao_minutos: parsed.duracao_minutos,
    preco: parsed.preco,
    categoria: parsed.categoria,
    cor: parsed.cor,
  };

  const { error } = await updateServico(id, patch);
  if (error) return { error: `Erro ao atualizar: ${error.message}` };

  revalidatePath("/servicos");
  return { success: "Serviço atualizado." };
}

export async function toggleAtivoServicoAction(
  formData: FormData
): Promise<ServicoFormResult> {
  await requirePermission("gerenciar_servicos");

  const id = String(formData.get("id") ?? "").trim();
  const ativo = String(formData.get("ativo") ?? "") === "true";
  if (!id) return { error: "ID do serviço ausente." };

  const { error } = await setServicoAtivo(id, ativo);
  if (error) return { error: `Erro: ${error.message}` };

  revalidatePath("/servicos");
  return { success: ativo ? "Serviço reativado." : "Serviço desativado." };
}