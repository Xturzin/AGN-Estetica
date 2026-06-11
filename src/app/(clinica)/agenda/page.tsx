import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { AgendaCompleta } from "@/frontend/components/screens/clinica/AgendaCompleta";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const supabase = createServerSupabaseClient();
  const { count: pendentes } = await supabase.from("aprovacoes").select("*", { count: "exact", head: true }).eq("status", "pendente");
  const { data: clinica } = await supabase.from("clinica").select("nome").limit(1).maybeSingle();
  return (
    <AgendaCompleta
      user={{ name: user.nome_completo ?? "Usuário", role: user.tipo }}
      aprovacoesPendentes={pendentes ?? 0}
      clinicaNome={clinica?.nome ?? "Clínica"}
    />
  );
}