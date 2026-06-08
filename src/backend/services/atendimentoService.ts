import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import type { Database } from "@/supabase/types/database.types";

export type Atendimento = Database["public"]["Tables"]["atendimentos"]["Row"];
export type AtendimentoInsert = Database["public"]["Tables"]["atendimentos"]["Insert"];
export type StatusAtendimento = Database["public"]["Enums"]["status_atendimento"];

export interface AtendimentoComRefs extends Atendimento {
  paciente: { id: string; nome_completo: string } | null;
  profissional: { id: string; nome_completo: string } | null;
  servico: { id: string; nome: string; duracao_minutos: number } | null;
}

interface IniciarParams {
  paciente_id: string;
  profissional_id: string;
  servico_id: string;
  agendamento_id: string | null;
}

export async function iniciarAtendimento(
  params: IniciarParams
): Promise<{ data: Atendimento | null; error: { message: string } | null }> {
  const supabase = createServerSupabaseClient();
  const agora = new Date().toISOString();

  const insert: AtendimentoInsert = {
    paciente_id: params.paciente_id,
    profissional_id: params.profissional_id,
    servico_id: params.servico_id,
    agendamento_id: params.agendamento_id,
    data_hora_inicio: agora,
    status: "em_andamento",
  };

  const { data, error } = await supabase
    .from("atendimentos")
    .insert(insert)
    .select()
    .single();

  if (error) return { data: null, error: { message: error.message } };

  if (params.agendamento_id) {
    await supabase
      .from("agendamentos")
      .update({ status: "em_andamento" })
      .eq("id", params.agendamento_id);
  }

  return { data, error: null };
}

export async function getAtendimentoComRefs(id: string): Promise<AtendimentoComRefs | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("atendimentos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const [pacRes, profRes, servRes] = await Promise.all([
    supabase.from("pacientes").select("id, nome_completo").eq("id", data.paciente_id).single(),
    supabase.from("usuarios").select("id, nome_completo").eq("id", data.profissional_id).single(),
    supabase.from("servicos").select("id, nome, duracao_minutos").eq("id", data.servico_id).single(),
  ]);

  return {
    ...data,
    paciente: pacRes.data,
    profissional: profRes.data,
    servico: servRes.data,
  };
}

interface FinalizarParams {
  observacoes: string | null;
}

export async function finalizarAtendimento(
  id: string,
  params: FinalizarParams
): Promise<{ data: Atendimento | null; error: { message: string } | null }> {
  const supabase = createServerSupabaseClient();

  const { data: atendimento, error: getErr } = await supabase
    .from("atendimentos")
    .select("*")
    .eq("id", id)
    .single();

  if (getErr || !atendimento) {
    return { data: null, error: { message: "Atendimento não encontrado." } };
  }

  const inicio = new Date(atendimento.data_hora_inicio);
  const agora = new Date();
  const duracao = Math.max(1, Math.round((agora.getTime() - inicio.getTime()) / 60_000));

  const { data, error } = await supabase
    .from("atendimentos")
    .update({
      data_hora_fim: agora.toISOString(),
      duracao_minutos: duracao,
      status: "concluido",
      observacoes: params.observacoes,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: { message: error.message } };

  if (atendimento.agendamento_id) {
    await supabase
      .from("agendamentos")
      .update({ status: "concluido" })
      .eq("id", atendimento.agendamento_id);
  }

  return { data, error: null };
}

export async function cancelarAtendimento(
  id: string
): Promise<{ error: { message: string } | null }> {
  const supabase = createServerSupabaseClient();

  const { data: atendimento } = await supabase
    .from("atendimentos")
    .select("agendamento_id")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("atendimentos")
    .update({ status: "cancelado" })
    .eq("id", id);

  if (error) return { error: { message: error.message } };

  if (atendimento?.agendamento_id) {
    await supabase
      .from("agendamentos")
      .update({ status: "agendado" })
      .eq("id", atendimento.agendamento_id);
  }

  return { error: null };
}