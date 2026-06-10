import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import type { Database } from "@/supabase/types/database.types";

export type Agendamento = Database["public"]["Tables"]["agendamentos"]["Row"];
export type AgendamentoInsert = Database["public"]["Tables"]["agendamentos"]["Insert"];
export type AgendamentoUpdate = Database["public"]["Tables"]["agendamentos"]["Update"];
export type StatusAgendamento = Database["public"]["Enums"]["status_agendamento"];

export interface AgendamentoComRefs extends Agendamento {
  paciente: { id: string; nome_completo: string } | null;
  profissional: { id: string; nome_completo: string; cor_agenda: string | null } | null;
  servico: { id: string; nome: string; duracao_minutos: number; cor: string | null } | null;
}

export interface ProfissionalRef {
  id: string;
  nome_completo: string;
  cor_agenda: string | null;
}

export interface PacienteRef {
  id: string;
  nome_completo: string;
}

export interface ServicoRef {
  id: string;
  nome: string;
  duracao_minutos: number;
  cor: string | null;
  preco?: number | null;
}

export async function listAgendamentosSemana(
  inicioSemana: Date
): Promise<AgendamentoComRefs[]> {
  const supabase = createServerSupabaseClient();

  const fim = new Date(inicioSemana);
  fim.setDate(fim.getDate() + 7);

  const { data: agendamentos, error } = await supabase
    .from("agendamentos")
    .select("*")
    .gte("data_hora_inicio", inicioSemana.toISOString())
    .lt("data_hora_inicio", fim.toISOString())
    .order("data_hora_inicio");

  if (error || !agendamentos || agendamentos.length === 0) return [];

  const pacienteIds = Array.from(new Set(agendamentos.map((a) => a.paciente_id)));
  const profissionalIds = Array.from(new Set(agendamentos.map((a) => a.profissional_id)));
  const servicoIds = Array.from(new Set(agendamentos.map((a) => a.servico_id)));

  const [pacRes, profRes, servRes] = await Promise.all([
    supabase.from("pacientes").select("id, nome_completo").in("id", pacienteIds),
    supabase.from("usuarios").select("id, nome_completo, cor_agenda").in("id", profissionalIds),
    supabase.from("servicos").select("id, nome, duracao_minutos, cor").in("id", servicoIds),
  ]);

  const mapP = new Map((pacRes.data ?? []).map((p) => [p.id, p]));
  const mapU = new Map((profRes.data ?? []).map((u) => [u.id, u]));
  const mapS = new Map((servRes.data ?? []).map((s) => [s.id, s]));

  return agendamentos.map((a) => ({
    ...a,
    paciente: mapP.get(a.paciente_id) ?? null,
    profissional: mapU.get(a.profissional_id) ?? null,
    servico: mapS.get(a.servico_id) ?? null,
  }));
}

export async function getAgendamento(id: string): Promise<AgendamentoComRefs | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const [pacRes, profRes, servRes] = await Promise.all([
    supabase.from("pacientes").select("id, nome_completo").eq("id", data.paciente_id).single(),
    supabase.from("usuarios").select("id, nome_completo, cor_agenda").eq("id", data.profissional_id).single(),
    supabase.from("servicos").select("id, nome, duracao_minutos, cor").eq("id", data.servico_id).single(),
  ]);

  return {
    ...data,
    paciente: pacRes.data,
    profissional: profRes.data,
    servico: servRes.data,
  };
}

export async function listProfissionaisAtivos(): Promise<ProfissionalRef[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("usuarios")
    .select("id, nome_completo, cor_agenda")
    .in("tipo", ["admin", "profissional"])
    .eq("ativo", true)
    .order("nome_completo");
  return data ?? [];
}

export async function listPacientesAtivosSimples(): Promise<PacienteRef[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("pacientes")
    .select("id, nome_completo")
    .eq("ativo", true)
    .order("nome_completo");
  return data ?? [];
}

export async function listServicosAtivosSimples(): Promise<ServicoRef[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("servicos")
    .select("id, nome, duracao_minutos, cor, preco")
    .eq("ativo", true)
    .order("nome");
  return data ?? [];
}

async function checkConflito(
  profissionalId: string,
  inicio: Date,
  fim: Date,
  ignoreId?: string
): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("agendamentos")
    .select("id, data_hora_inicio, data_hora_fim")
    .eq("profissional_id", profissionalId)
    .not("status", "in", "(cancelado,falta)")
    .lt("data_hora_inicio", fim.toISOString())
    .gt("data_hora_fim", inicio.toISOString());

  if (ignoreId) {
    query = query.neq("id", ignoreId);
  }

  const { data } = await query;
  return (data?.length ?? 0) > 0;
}

interface CreateAgendamentoParams {
  paciente_id: string;
  profissional_id: string;
  servico_id: string;
  data_hora_inicio: string;
  duracao_minutos: number;
  observacoes: string | null;
  criado_por: string;
}

export async function createAgendamento(
  params: CreateAgendamentoParams
): Promise<{ data: Agendamento | null; error: { message: string } | null }> {
  const inicio = new Date(params.data_hora_inicio);
  const fim = new Date(inicio.getTime() + params.duracao_minutos * 60_000);

  const conflito = await checkConflito(params.profissional_id, inicio, fim);
  if (conflito) {
    return {
      data: null,
      error: { message: "Conflito: o profissional já tem agendamento nesse horário." },
    };
  }

  const supabase = createServerSupabaseClient();
  const insert: AgendamentoInsert = {
    paciente_id: params.paciente_id,
    profissional_id: params.profissional_id,
    servico_id: params.servico_id,
    data_hora_inicio: inicio.toISOString(),
    data_hora_fim: fim.toISOString(),
    status: "agendado",
    tipo: "clinica",
    observacoes: params.observacoes,
    criado_por: params.criado_por,
  };

  const { data, error } = await supabase
    .from("agendamentos")
    .insert(insert)
    .select()
    .single();

  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

interface UpdateAgendamentoParams {
  paciente_id?: string;
  profissional_id?: string;
  servico_id?: string;
  data_hora_inicio?: string;
  duracao_minutos?: number;
  status?: StatusAgendamento;
  observacoes?: string | null;
}

export async function updateAgendamento(
  id: string,
  params: UpdateAgendamentoParams
): Promise<{ data: Agendamento | null; error: { message: string } | null }> {
  const supabase = createServerSupabaseClient();

  const update: AgendamentoUpdate = {};
  if (params.paciente_id !== undefined) update.paciente_id = params.paciente_id;
  if (params.profissional_id !== undefined) update.profissional_id = params.profissional_id;
  if (params.servico_id !== undefined) update.servico_id = params.servico_id;
  if (params.status !== undefined) update.status = params.status;
  if (params.observacoes !== undefined) update.observacoes = params.observacoes;

  if (params.data_hora_inicio !== undefined && params.duracao_minutos !== undefined) {
    const inicio = new Date(params.data_hora_inicio);
    const fim = new Date(inicio.getTime() + params.duracao_minutos * 60_000);

    const profParaCheck = params.profissional_id;
    if (profParaCheck) {
      const conflito = await checkConflito(profParaCheck, inicio, fim, id);
      if (conflito) {
        return {
          data: null,
          error: { message: "Conflito: o profissional já tem agendamento nesse horário." },
        };
      }
    }

    update.data_hora_inicio = inicio.toISOString();
    update.data_hora_fim = fim.toISOString();
  }

  const { data, error } = await supabase
    .from("agendamentos")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

export async function cancelarAgendamento(
  id: string
): Promise<{ error: { message: string } | null }> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("agendamentos")
    .update({ status: "cancelado" })
    .eq("id", id);

  if (error) return { error: { message: error.message } };
  return { error: null };
}