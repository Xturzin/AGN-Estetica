import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import type { Database } from "@/supabase/types/database.types";

export type Paciente = Database["public"]["Tables"]["pacientes"]["Row"];
export type PacienteInsert = Database["public"]["Tables"]["pacientes"]["Insert"];
export type PacienteUpdate = Database["public"]["Tables"]["pacientes"]["Update"];

/** Lista pacientes. Por default, apenas ativos. */
export async function listPacientes(includeInativos = false): Promise<Paciente[]> {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("pacientes")
    .select("*")
    .order("nome_completo", { ascending: true });
  if (!includeInativos) {
    query = query.eq("ativo", true);
  }
  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

/** Busca paciente por id. */
export async function getPaciente(id: string): Promise<Paciente | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

/** Cria paciente. Admin client (RLS não tem policy de INSERT em pacientes). */
export async function createPaciente(
  insert: PacienteInsert
): Promise<{ data: Paciente | null; error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("pacientes")
    .insert(insert)
    .select()
    .single();
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

/** Atualiza paciente. */
export async function updatePaciente(
  id: string,
  patch: PacienteUpdate
): Promise<{ data: Paciente | null; error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("pacientes")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

/** Ativa/desativa paciente (soft delete bidirecional). */
export async function setPacienteAtivo(
  id: string,
  ativo: boolean
): Promise<{ error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("pacientes").update({ ativo }).eq("id", id);
  if (error) return { error: { message: error.message } };
  return { error: null };
}