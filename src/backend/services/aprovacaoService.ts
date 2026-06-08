import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import type { Database } from "@/supabase/types/database.types";

export type Aprovacao = Database["public"]["Tables"]["aprovacoes"]["Row"];
export type TipoAprovacao = Database["public"]["Enums"]["tipo_aprovacao"];
export type StatusAprovacao = Database["public"]["Enums"]["status_aprovacao"];

export interface AprovacaoComSolicitante extends Aprovacao {
  solicitante: { id: string; nome_completo: string } | null;
}

export async function listAprovacoesPendentes(): Promise<AprovacaoComSolicitante[]> {
  const supabase = createServerSupabaseClient();

  const { data: aprovacoes, error } = await supabase
    .from("aprovacoes")
    .select("*")
    .eq("status", "pendente")
    .order("created_at", { ascending: true });

  if (error || !aprovacoes || aprovacoes.length === 0) return [];

  const solicitanteIds = Array.from(new Set(aprovacoes.map((a) => a.solicitante_id)));
  const { data: solicitantes } = await supabase
    .from("usuarios")
    .select("id, nome_completo")
    .in("id", solicitanteIds);

  const mapU = new Map((solicitantes ?? []).map((s) => [s.id, s]));

  return aprovacoes.map((a) => ({
    ...a,
    solicitante: mapU.get(a.solicitante_id) ?? null,
  }));
}

export async function getAprovacao(id: string): Promise<Aprovacao | null> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("aprovacoes").select("*").eq("id", id).single();
  return data;
}

export async function resolverAprovacao(
  id: string,
  status: "aprovado" | "recusado",
  resolvido_por: string,
  agendamento_id?: string | null
): Promise<{ error: { message: string } | null }> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("aprovacoes")
    .update({
      status,
      resolvido_por,
      resolvido_em: new Date().toISOString(),
      agendamento_id: agendamento_id ?? null,
    })
    .eq("id", id);

  if (error) return { error: { message: error.message } };
  return { error: null };
}