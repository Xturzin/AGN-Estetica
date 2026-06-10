import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import type { AgendamentoComRefs } from "@/backend/services/agendamentoService";
import type { AtendimentoComRefs } from "@/backend/services/atendimentoService";

export interface DashboardKPIs {
  totalPacientesAtivos: number;
  cadastrosNoMes: number;
  proximosAgendamentos: number | null;
  aprovacoesPendentes: number | null;
}

export interface DashboardHojeData {
  agendamentosHoje: AgendamentoComRefs[];
  atendimentoEmAndamento: AtendimentoComRefs | null;
  aprovacoesPendentes: number;
  totalHoje: number;
  concluidos: number;
}

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const supabase = createServerSupabaseClient();

  const { count: totalAtivos } = await supabase
    .from("pacientes")
    .select("*", { count: "exact", head: true })
    .eq("ativo", true);

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const { count: cadastrosMes } = await supabase
    .from("pacientes")
    .select("*", { count: "exact", head: true })
    .gte("created_at", inicioMes.toISOString());

  return {
    totalPacientesAtivos: totalAtivos ?? 0,
    cadastrosNoMes: cadastrosMes ?? 0,
    proximosAgendamentos: null,
    aprovacoesPendentes: null,
  };
}

async function enrichAgendamento(supabase: ReturnType<typeof createServerSupabaseClient>, ag: { id: string; paciente_id: string; profissional_id: string; servico_id: string }) {
  const [pacRes, profRes, servRes] = await Promise.all([
    supabase.from("pacientes").select("id, nome_completo").eq("id", ag.paciente_id).single(),
    supabase.from("usuarios").select("id, nome_completo, cor_agenda").eq("id", ag.profissional_id).single(),
    supabase.from("servicos").select("id, nome, duracao_minutos, cor").eq("id", ag.servico_id).single(),
  ]);
  return {
    paciente: pacRes.data,
    profissional: profRes.data,
    servico: servRes.data,
  };
}

export async function getDashboardHoje(): Promise<DashboardHojeData> {
  const supabase = createServerSupabaseClient();
  const inicioHoje = new Date();
  inicioHoje.setHours(0, 0, 0, 0);
  const fimHoje = new Date(inicioHoje);
  fimHoje.setDate(fimHoje.getDate() + 1);

  const { data: ags } = await supabase
    .from("agendamentos")
    .select("*")
    .gte("data_hora_inicio", inicioHoje.toISOString())
    .lt("data_hora_inicio", fimHoje.toISOString())
    .order("data_hora_inicio");

  const agendamentos = ags ?? [];
  const agendamentosHoje = await Promise.all(
    agendamentos.map(async (a) => ({
      ...a,
      ...(await enrichAgendamento(supabase, a)),
    }))
  );

  const concluidos = agendamentosHoje.filter((a) => a.status === "concluido").length;

  const { data: emAndamento } = await supabase
    .from("atendimentos")
    .select("*")
    .eq("status", "em_andamento")
    .order("data_hora_inicio", { ascending: false })
    .limit(1)
    .maybeSingle();

  let atendimentoEmAndamento = null;
  if (emAndamento) {
    const refs = await enrichAgendamento(supabase, emAndamento);
    atendimentoEmAndamento = { ...emAndamento, ...refs } as AtendimentoComRefs;
  }

  const { count: aprovCount } = await supabase
    .from("aprovacoes")
    .select("*", { count: "exact", head: true })
    .eq("status", "pendente");

  return {
    agendamentosHoje: agendamentosHoje as AgendamentoComRefs[],
    atendimentoEmAndamento,
    aprovacoesPendentes: aprovCount ?? 0,
    totalHoje: agendamentosHoje.length,
    concluidos,
  };
}

import type { AprovacaoComSolicitante } from "@/backend/services/aprovacaoService";

export interface DashboardCompletoData {
  kpis: {
    atendimentosHoje: number;
    proximas24h: number;
    novosPacientesMes: number;
    aprovacoesPendentes: number;
  };
  agendaHoje: AgendamentoComRefs[];
  aprovacoes: AprovacaoComSolicitante[];
}

export async function getDashboardCompleto(): Promise<DashboardCompletoData> {
  const supabase = createServerSupabaseClient();
  const agora = new Date();
  const inicioHoje = new Date(agora);
  inicioHoje.setHours(0, 0, 0, 0);
  const fimHoje = new Date(inicioHoje);
  fimHoje.setDate(fimHoje.getDate() + 1);

  const proximas24h = new Date(agora.getTime() + 24 * 60 * 60 * 1000);

  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString();

  // Agenda hoje
  const { data: ags } = await supabase
    .from("agendamentos")
    .select("*")
    .gte("data_hora_inicio", inicioHoje.toISOString())
    .lt("data_hora_inicio", fimHoje.toISOString())
    .order("data_hora_inicio")
    .limit(7);

  const agendaHoje = await Promise.all(
    (ags ?? []).map(async (a) => {
      const [pacRes, profRes, servRes] = await Promise.all([
        supabase.from("pacientes").select("id, nome_completo").eq("id", a.paciente_id).single(),
        supabase.from("usuarios").select("id, nome_completo, cor_agenda").eq("id", a.profissional_id).single(),
        supabase.from("servicos").select("id, nome, duracao_minutos, cor").eq("id", a.servico_id).single(),
      ]);
      return { ...a, paciente: pacRes.data, profissional: profRes.data, servico: servRes.data };
    })
  );

  // Contagens
  const { count: atendimentosHoje } = await supabase
    .from("atendimentos")
    .select("*", { count: "exact", head: true })
    .gte("data_hora_inicio", inicioHoje.toISOString())
    .lt("data_hora_inicio", fimHoje.toISOString());

  const { count: proximas24hCount } = await supabase
    .from("agendamentos")
    .select("*", { count: "exact", head: true })
    .gte("data_hora_inicio", agora.toISOString())
    .lt("data_hora_inicio", proximas24h.toISOString())
    .in("status", ["agendado", "confirmado"]);

  const { count: novosPacientesMes } = await supabase
    .from("pacientes")
    .select("*", { count: "exact", head: true })
    .gte("created_at", inicioMes)
    .eq("ativo", true);

  const { count: aprovCount } = await supabase
    .from("aprovacoes")
    .select("*", { count: "exact", head: true })
    .eq("status", "pendente");

  // Aprovações com solicitante
  const { data: aprovs } = await supabase
    .from("aprovacoes")
    .select("*")
    .eq("status", "pendente")
    .order("created_at", { ascending: false })
    .limit(3);

  const aprovacoes = await Promise.all(
    (aprovs ?? []).map(async (a) => {
      const { data: solic } = await supabase
        .from("usuarios")
        .select("id, nome_completo")
        .eq("id", a.solicitante_id)
        .single();
      return { ...a, solicitante: solic } as AprovacaoComSolicitante;
    })
  );

  return {
    kpis: {
      atendimentosHoje: atendimentosHoje ?? 0,
      proximas24h: proximas24hCount ?? 0,
      novosPacientesMes: novosPacientesMes ?? 0,
      aprovacoesPendentes: aprovCount ?? 0,
    },
    agendaHoje: agendaHoje as AgendamentoComRefs[],
    aprovacoes,
  };
}