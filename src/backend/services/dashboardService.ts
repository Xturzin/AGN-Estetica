import { createServerSupabaseClient } from "@/backend/lib/supabase/server";

export interface DashboardKPIs {
  totalPacientesAtivos: number;
  cadastrosNoMes: number;
  proximosAgendamentos: number | null;
  aprovacoesPendentes: number | null;
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