import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import type { Database } from "@/supabase/types/database.types";
import type { EvolucaoComAutor } from "@/backend/services/evolucaoService";
import type { FotoComUrl } from "@/backend/services/fotoClinicaService";
import type { DocumentoComUrl } from "@/backend/services/documentoService";
import type { AgendamentoComRefs } from "@/backend/services/agendamentoService";
import type { Anamnese } from "@/backend/services/anamneseService";
import { getAnamnese } from "@/backend/services/anamneseService";
import { listEvolucoesPaciente } from "@/backend/services/evolucaoService";
import { listFotosPaciente } from "@/backend/services/fotoClinicaService";
import { listDocumentosPaciente } from "@/backend/services/documentoService";

export type Paciente = Database["public"]["Tables"]["pacientes"]["Row"];
export type PacienteInsert = Database["public"]["Tables"]["pacientes"]["Insert"];
export type PacienteUpdate = Database["public"]["Tables"]["pacientes"]["Update"];

// =========== Listagem / busca ===========

export async function listPacientes(): Promise<Paciente[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("pacientes")
    .select("*")
    .eq("ativo", true)
    .order("nome_completo");
  return data ?? [];
}

export async function getPacienteById(id: string): Promise<Paciente | null> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function searchPacientes(termo: string): Promise<Paciente[]> {
  const supabase = createServerSupabaseClient();
  const q = `%${termo}%`;
  const { data } = await supabase
    .from("pacientes")
    .select("*")
    .or(`nome_completo.ilike.${q},email.ilike.${q},telefone.ilike.${q}`)
    .eq("ativo", true)
    .order("nome_completo");
  return data ?? [];
}

// =========== Mutações ===========

export async function createPaciente(input: PacienteInsert): Promise<{ data: Paciente | null; error: { message: string } | null }> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pacientes")
    .insert(input)
    .select()
    .single();
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

export async function updatePaciente(id: string, input: PacienteUpdate): Promise<{ data: Paciente | null; error: { message: string } | null }> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pacientes")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) return { data: null, error: { message: error.message } };
  return { data, error: null };
}

export async function softDeletePaciente(id: string): Promise<{ error: { message: string } | null }> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("pacientes")
    .update({ ativo: false })
    .eq("id", id);
  if (error) return { error: { message: error.message } };
  return { error: null };
}

// =========== Perfil completo (Stage P6) ===========

export interface PerfilPacienteStats {
  totalAtendimentos: number;
  ultimoProcedimento: string | null;
  proximoAgendamento: string | null;
}

export interface PerfilPacienteCompleto {
  paciente: Paciente;
  anamnese: Anamnese | null;
  evolucoes: EvolucaoComAutor[];
  fotos: FotoComUrl[];
  agendamentos: AgendamentoComRefs[];
  documentos: DocumentoComUrl[];
  stats: PerfilPacienteStats;
}

export async function getPerfilPacienteCompleto(id: string): Promise<PerfilPacienteCompleto | null> {
  const paciente = await getPacienteById(id);
  if (!paciente) return null;

  const supabase = createServerSupabaseClient();
  const agora = new Date().toISOString();

  const [anamnese, evolucoes, fotos, documentos, agsFut, atendCount, ultimoProc] = await Promise.all([
    getAnamnese(id),
    listEvolucoesPaciente(id),
    listFotosPaciente(id),
    listDocumentosPaciente(id),
    supabase
      .from("agendamentos")
      .select("*")
      .eq("paciente_id", id)
      .gte("data_hora_inicio", agora)
      .in("status", ["agendado", "confirmado"])
      .order("data_hora_inicio")
      .limit(3),
    supabase
      .from("atendimentos")
      .select("*", { count: "exact", head: true })
      .eq("paciente_id", id)
      .eq("status", "concluido"),
    supabase
      .from("evolucoes")
      .select("titulo")
      .eq("paciente_id", id)
      .order("data_hora", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const agendamentos: AgendamentoComRefs[] = await Promise.all(
    (agsFut.data ?? []).map(async (a: { id: string; paciente_id: string; profissional_id: string; servico_id: string }) => {
      const [pacRes, profRes, servRes] = await Promise.all([
        supabase.from("pacientes").select("id, nome_completo").eq("id", a.paciente_id).single(),
        supabase.from("usuarios").select("id, nome_completo, cor_agenda").eq("id", a.profissional_id).single(),
        supabase.from("servicos").select("id, nome, duracao_minutos, cor").eq("id", a.servico_id).single(),
      ]);
      return { ...a, paciente: pacRes.data, profissional: profRes.data, servico: servRes.data } as AgendamentoComRefs;
    })
  );

  return {
    paciente,
    anamnese,
    evolucoes,
    fotos,
    agendamentos,
    documentos,
    stats: {
      totalAtendimentos: atendCount.count ?? 0,
      ultimoProcedimento: ultimoProc.data?.titulo ?? null,
      proximoAgendamento: agendamentos[0]?.data_hora_inicio ?? null,
    },
  };
}