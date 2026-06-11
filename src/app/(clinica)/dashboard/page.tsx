import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { DashboardPrincipal } from "@/frontend/components/screens/clinica/DashboardPrincipal";

function saudacao(): string {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function dataExtensa(): string {
  const d = new Date();
  const dias = ["DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA", "SÁBADO"];
  const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  return `${dias[d.getDay()]}, ${d.getDate()} DE ${meses[d.getMonth()]}`;
}

function pegarPrimeiroNome(nome: string | null | undefined): string {
  if (!nome) return "Usuário";
  const palavras = nome.split(" ").filter(Boolean);
  const titulos = ["dra.", "dr.", "sra.", "sr.", "dra", "dr"];
  for (const palavra of palavras) {
    if (!titulos.includes(palavra.toLowerCase())) return palavra;
  }
  return palavras[0] ?? "Usuário";
}

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  const supabase = createServerSupabaseClient();
  const { count: pendentes } = await supabase.from("aprovacoes").select("*", { count: "exact", head: true }).eq("status", "pendente");
  const { data: clinica } = await supabase.from("clinica").select("nome").limit(1).maybeSingle();

  return (
    <DashboardPrincipal
      user={{ name: user.nome_completo ?? "Usuário", role: user.tipo === "admin" ? "Administradora" : user.tipo === "profissional" ? "Profissional" : "Recepcionista" }}
      saudacao={saudacao()}
      primeiroNome={pegarPrimeiroNome(user.nome_completo)}
      data={dataExtensa()}
      aprovacoesPendentes={pendentes ?? 0}
      clinicaNome={clinica?.nome ?? "Clínica"}
    />
  );
}