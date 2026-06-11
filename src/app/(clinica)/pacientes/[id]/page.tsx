import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { getPacienteById } from "@/backend/services/pacienteService";
import { PerfilDoPaciente } from "@/frontend/components/screens/clinica/PerfilDoPaciente";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const paciente = await getPacienteById(params.id);
  if (!paciente) notFound();

  const supabase = createServerSupabaseClient();
  const { count: pendentes } = await supabase.from("aprovacoes").select("*", { count: "exact", head: true }).eq("status", "pendente");
  const { data: clinica } = await supabase.from("clinica").select("nome").limit(1).maybeSingle();

  return (
    <PerfilDoPaciente
      user={{ name: user.nome_completo ?? "Usuário", role: user.tipo }}
      aprovacoesPendentes={pendentes ?? 0}
      clinicaNome={clinica?.nome ?? "Clínica"}
      pacienteNome={paciente.nome_completo}
    />
  );
}