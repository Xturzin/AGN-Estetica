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

interface CriarSolicitacaoParams {
  solicitante_id: string;
  paciente_id: string;
  profissional_id: string;
  servico_id: string;
  servico_nome: string;
  data_hora_preferida: string;
  duracao_minutos: number;
  observacoes: string | null;
}

export async function criarSolicitacaoAgendamento(
  params: CriarSolicitacaoParams
): Promise<{ data: Aprovacao | null; error: { message: string } | null }> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("aprovacoes")
    .insert({
      tipo: "solicitacao_agendamento",
      status: "pendente",
      solicitante_id: params.solicitante_id,
      dados: {
        paciente_id: params.paciente_id,
        profissional_id: params.profissional_id,
        servico_id: params.servico_id,
        servico_nome: params.servico_nome,
        data_hora_preferida: params.data_hora_preferida,
        duracao_minutos: params.duracao_minutos,
        observacoes: params.observacoes,
      },
    })
    .select()
    .single();

  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

export async function listUsuariosQueAprovam(): Promise<{ id: string; email: string | null; nome_completo: string }[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("usuarios")
    .select("id, email, nome_completo")
    .in("tipo", ["admin", "recepcionista"])
    .eq("ativo", true);
  return data ?? [];
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