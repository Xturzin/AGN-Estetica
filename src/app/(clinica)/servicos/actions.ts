"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { requirePermission } from "@/backend/lib/auth/permissions";

export async function createServicoAction(formData: FormData): Promise<{ error?: string }> {
  await requirePermission("gerenciar_servicos");

  const nome = String(formData.get("nome") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim() || undefined;
  const duracao = parseInt(String(formData.get("duracao_minutos") ?? "0"), 10);
  const precoStr = String(formData.get("preco") ?? "").trim();
  const preco = precoStr ? Number(precoStr) : undefined;

  if (!nome) return { error: "Nome é obrigatório." };
  if (!duracao || duracao < 1) return { error: "Duração inválida." };

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("servicos").insert({
    nome,
    categoria,
    duracao_minutos: duracao,
    preco: preco ?? 0,
    ativo: true,
  });

  if (error) return { error: error.message };
  revalidatePath("/servicos");
  return {};
}

export async function toggleServicoAction(formData: FormData): Promise<void> {
  await requirePermission("gerenciar_servicos");

  const id = String(formData.get("id") ?? "");
  const ativo = String(formData.get("ativo") ?? "") === "true";
  if (!id) return;

  const supabase = createServerSupabaseClient();
  await supabase.from("servicos").update({ ativo }).eq("id", id);
  revalidatePath("/servicos");
}