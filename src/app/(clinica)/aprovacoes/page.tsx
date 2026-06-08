import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { listAprovacoesPendentes } from "@/backend/services/aprovacaoService";
import { AprovacaoList } from "@/frontend/components/clinica/AprovacaoList";
import { aprovarAction, recusarAction } from "./actions";

export default async function AprovacoesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  const aprovacoes = await listAprovacoesPendentes();

  return (
    <div style={{ padding: "32px clamp(20px, 4vw, 48px)", maxWidth: 880, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
        Aprovações
      </h1>
      <p style={{ fontSize: 14, color: "var(--ink-3)", margin: "0 0 24px" }}>
        Pendências que esperam um aval da clínica.
      </p>
      <AprovacaoList
        aprovacoes={aprovacoes}
        aprovarAction={aprovarAction}
        recusarAction={recusarAction}
      />
    </div>
  );
}