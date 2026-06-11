import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { listPacientes } from "@/backend/services/pacienteService";
import { ListaDePacientes } from "@/frontend/components/screens/clinica/ListaDePacientes";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = createServerSupabaseClient();
  const [pacientes, { count: pendentes }, { data: clinica }] = await Promise.all([
    listPacientes(),
    supabase.from("aprovacoes").select("*", { count: "exact", head: true }).eq("status", "pendente"),
    supabase.from("clinica").select("nome").limit(1).maybeSingle(),
  ]);

  const ui = pacientes.map(p => ({
    id: p.id,
    n: p.nome_completo,
    e: p.email ?? "—",
    ph: p.telefone ?? "—",
    last: p.updated_at ? new Date(p.updated_at).toLocaleDateString("pt-BR") : "—",
    next: "—",
    st: (p.status === "em_tratamento" ? "warn" : p.status === "inativo" ? "muted" : "ok") as "ok" | "warn" | "muted" | "info",
    stl: p.status === "em_tratamento" ? "Em tratamento" : p.status === "inativo" ? "Inativo" : "Ativo",
    ct: 0,
  }));

  return (
    <ListaDePacientes
      user={{ name: user.nome_completo ?? "Usuário", role: user.tipo }}
      aprovacoesPendentes={pendentes ?? 0}
      clinicaNome={clinica?.nome ?? "Clínica"}
      pacientes={ui}
    />
  );
}