"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { requirePermission } from "@/backend/lib/auth/permissions";

export async function updateClinicaAction(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  await requirePermission("editar_configuracoes");

  const nome = String(formData.get("nome") ?? "").trim() || undefined;
  const cnpj = String(formData.get("cnpj") ?? "").trim() || undefined;
  const telefone = String(formData.get("telefone") ?? "").trim() || undefined;
  const email = String(formData.get("email") ?? "").trim() || undefined;
  const endereco = String(formData.get("endereco") ?? "").trim() || undefined;

  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase.from("clinica").select("id").limit(1).maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("clinica")
      .update({ nome, cnpj, telefone, email, endereco })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    if (!nome) return { error: "Nome da clínica é obrigatório." };
    const { error } = await supabase.from("clinica").insert({ nome, cnpj, telefone, email, endereco });
    if (error) return { error: error.message };
  }

  revalidatePath("/configuracoes");
  return { success: true };
}