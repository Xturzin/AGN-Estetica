import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { createAdminSupabaseClient } from "@/backend/lib/supabase/admin";
import type { Database } from "@/supabase/types/database.types";

export type Anamnese = Database["public"]["Tables"]["anamnese"]["Row"];
export type AnamneseInsert = Database["public"]["Tables"]["anamnese"]["Insert"];
export type AnamneseUpdate = Database["public"]["Tables"]["anamnese"]["Update"];

/**
 * Estrutura aberta de cada seção JSONB.
 * As chaves são definidas pelo front (steps.ts) e o back só persiste.
 */
export type AnamneseSecaoData = Record<string, unknown>;

type AnamneseJsonField = AnamneseInsert["dados_gerais"];

function toJsonField(value: AnamneseSecaoData | null | undefined): AnamneseJsonField {
  if (value === undefined || value === null) return null;
  return value as AnamneseJsonField;
}

/** Busca a anamnese de um paciente (1:1, pode não existir ainda). */
export async function getAnamnese(pacienteId: string): Promise<Anamnese | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("anamnese")
    .select("*")
    .eq("paciente_id", pacienteId)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

interface UpsertAnamneseParams {
  paciente_id: string;
  dados_gerais?: AnamneseSecaoData;
  saude?: AnamneseSecaoData;
  habitos?: AnamneseSecaoData;
  contraindicacoes?: AnamneseSecaoData;
  preenchida_por_cliente?: boolean;
  atualizada_por: string;
}

/**
 * Upsert da anamnese: cria se não existe, atualiza seções fornecidas.
 * Seções não fornecidas preservam valor atual (merge no nível de seção, não dos campos internos).
 */
export async function upsertAnamnese(
  params: UpsertAnamneseParams
): Promise<{ data: Anamnese | null; error: { message: string } | null }> {
  const admin = createAdminSupabaseClient();

  const { data: current } = await admin
    .from("anamnese")
    .select("*")
    .eq("paciente_id", params.paciente_id)
    .maybeSingle();

  const payload: AnamneseInsert = {
    paciente_id: params.paciente_id,
    atualizada_por: params.atualizada_por,
    dados_gerais:
      params.dados_gerais !== undefined
        ? toJsonField(params.dados_gerais)
        : current?.dados_gerais ?? null,
    saude:
      params.saude !== undefined
        ? toJsonField(params.saude)
        : current?.saude ?? null,
    habitos:
      params.habitos !== undefined
        ? toJsonField(params.habitos)
        : current?.habitos ?? null,
    contraindicacoes:
      params.contraindicacoes !== undefined
        ? toJsonField(params.contraindicacoes)
        : current?.contraindicacoes ?? null,
    preenchida_por_cliente:
      params.preenchida_por_cliente ??
      current?.preenchida_por_cliente ??
      false,
  };

  const { data, error } = await admin
    .from("anamnese")
    .upsert(payload, { onConflict: "paciente_id" })
    .select()
    .single();

  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

/**
 * Lê uma seção específica como objeto tipado.
 * Helper pra components que só precisam de uma parte.
 */
export function getSecaoAsObject(
  anamnese: Anamnese | null,
  secao: "dados_gerais" | "saude" | "habitos" | "contraindicacoes"
): AnamneseSecaoData {
  if (!anamnese) return {};
  const value = anamnese[secao];
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as AnamneseSecaoData;
}