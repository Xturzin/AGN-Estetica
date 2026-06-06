import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import type { Database } from "@/supabase/types/database.types";

export type Servico = Database["public"]["Tables"]["servicos"]["Row"];
export type ServicoInsert = Database["public"]["Tables"]["servicos"]["Insert"];
export type ServicoUpdate = Database["public"]["Tables"]["servicos"]["Update"];

/** Lista serviços. Por default, apenas ativos. */
export async function listServicos(includeInativos = false): Promise<Servico[]> {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("servicos").select("*").order("nome", { ascending: true });
  if (!includeInativos) {
    query = query.eq("ativo", true);
  }
  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

/** Busca um serviço específico. */
export async function getServico(id: string): Promise<Servico | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("servicos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

/**
 * Cria serviço. Usa admin client (RLS não tem policy de INSERT em servicos).
 * Permissão deve ser validada ANTES via requirePermission('gerenciar_servicos').
 */
export async function createServico(
  insert: ServicoInsert
): Promise<{ data: Servico | null; error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.from("servicos").insert(insert).select().single();
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

/** Atualiza serviço. */
export async function updateServico(
  id: string,
  patch: ServicoUpdate
): Promise<{ data: Servico | null; error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("servicos")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

/** Alterna ativo/inativo (soft delete bidirecional). */
export async function setServicoAtivo(
  id: string,
  ativo: boolean
): Promise<{ error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("servicos").update({ ativo }).eq("id", id);
  if (error) return { error: { message: error.message } };
  return { error: null };
}

/** Lista categorias únicas já cadastradas (para datalist de sugestões). */
export async function listCategorias(): Promise<string[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("servicos")
    .select("categoria")
    .not("categoria", "is", null);
  if (error || !data) return [];
  const set = new Set<string>();
  data.forEach((row) => {
    if (row.categoria) set.add(row.categoria);
  });
  return Array.from(set).sort();
}