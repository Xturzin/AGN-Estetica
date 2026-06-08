import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import type { Paciente } from "@/backend/services/pacienteService";
import type { AgendamentoComRefs } from "@/backend/services/agendamentoService";

export async function getPacienteDoUsuario(usuarioId: string): Promise<Paciente | null> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("pacientes")
    .select("*")
    .eq("usuario_id", usuarioId)
    .maybeSingle();
  return data;
}

export async function getProximoAgendamento(
  pacienteId: string
): Promise<AgendamentoComRefs | null> {
  const supabase = createServerSupabaseClient();
  const agora = new Date().toISOString();

  const { data: ag } = await supabase
    .from("agendamentos")
    .select("*")
    .eq("paciente_id", pacienteId)
    .gte("data_hora_inicio", agora)
    .in("status", ["agendado", "confirmado"])
    .order("data_hora_inicio")
    .limit(1)
    .maybeSingle();

  if (!ag) return null;

  const [pacRes, profRes, servRes] = await Promise.all([
    supabase.from("pacientes").select("id, nome_completo").eq("id", ag.paciente_id).single(),
    supabase.from("usuarios").select("id, nome_completo, cor_agenda").eq("id", ag.profissional_id).single(),
    supabase.from("servicos").select("id, nome, duracao_minutos, cor").eq("id", ag.servico_id).single(),
  ]);

  return {
    ...ag,
    paciente: pacRes.data,
    profissional: profRes.data,
    servico: servRes.data,
  };
}