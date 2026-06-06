import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import type { Database } from "@/supabase/types/database.types";

export type Clinica = Database["public"]["Tables"]["clinica"]["Row"];
export type ClinicaUpdate = Database["public"]["Tables"]["clinica"]["Update"];

/**
 * Busca a única clínica (single-tenant).
 * Read via server client (RLS permite SELECT pra qualquer autenticado).
 */
export async function getClinica(): Promise<Clinica | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("clinica")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

/**
 * Atualiza dados da clínica.
 * Usa admin client (service_role) — RLS de clinica não tem policy de UPDATE.
 * IMPORTANTE: validação de permissão deve acontecer ANTES de chamar essa função
 * (via requirePermission('editar_configuracoes')).
 */
export async function updateClinica(
  id: string,
  patch: ClinicaUpdate
): Promise<{ data: Clinica | null; error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("clinica")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: { message: error.message } };
  }
  return { data, error: null };
}