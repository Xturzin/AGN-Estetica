import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import type { Database } from "@/supabase/types/database.types";

export type Evolucao = Database["public"]["Tables"]["evolucoes"]["Row"];
export type EvolucaoInsert = Database["public"]["Tables"]["evolucoes"]["Insert"];
export type EvolucaoUpdate = Database["public"]["Tables"]["evolucoes"]["Update"];
export type TipoEvolucao = Database["public"]["Enums"]["tipo_evolucao"];

export interface EvolucaoComAutor extends Evolucao {
  profissional: {
    nome_completo: string;
    cor_agenda: string | null;
  } | null;
}

/**
 * Lista evoluções de um paciente, mais recente primeiro.
 * Faz join manual com usuarios pra trazer nome do autor.
 */
export async function listEvolucoesPaciente(
  pacienteId: string
): Promise<EvolucaoComAutor[]> {
  const supabase = createServerSupabaseClient();

  const { data: evolucoes, error } = await supabase
    .from("evolucoes")
    .select("*")
    .eq("paciente_id", pacienteId)
    .order("data_hora", { ascending: false });

  if (error || !evolucoes || evolucoes.length === 0) return [];

  const profIds = Array.from(
    new Set(
      evolucoes
        .map((e) => e.profissional_id)
        .filter((id): id is string => !!id)
    )
  );

  if (profIds.length === 0) {
    return evolucoes.map((e) => ({ ...e, profissional: null }));
  }

  const { data: profs } = await supabase
    .from("usuarios")
    .select("id, nome_completo, cor_agenda")
    .in("id", profIds);

  const profMap = new Map(
    (profs ?? []).map((p) => [
      p.id,
      { nome_completo: p.nome_completo, cor_agenda: p.cor_agenda },
    ])
  );

  return evolucoes.map((e) => ({
    ...e,
    profissional: e.profissional_id
      ? profMap.get(e.profissional_id) ?? null
      : null,
  }));
}

export async function getEvolucao(id: string): Promise<Evolucao | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("evolucoes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function createEvolucao(
  insert: EvolucaoInsert
): Promise<{ data: Evolucao | null; error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("evolucoes")
    .insert(insert)
    .select()
    .single();
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

export async function updateEvolucao(
  id: string,
  patch: EvolucaoUpdate
): Promise<{ data: Evolucao | null; error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("evolucoes")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}