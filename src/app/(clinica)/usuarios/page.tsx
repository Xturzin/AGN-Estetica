import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";
import { ClinicShell } from "@/frontend/components/clinica/Shell";
import { Avatar, Pill, Btn } from "@/frontend/components/ui";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = createServerSupabaseClient();
  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("id, nome_completo, email, tipo, ativo")
    .order("nome_completo");
  const { count: pendentes } = await supabase
    .from("aprovacoes")
    .select("*", { count: "exact", head: true })
    .eq("status", "pendente");
  const { data: clinica } = await supabase
    .from("clinica")
    .select("nome")
    .limit(1)
    .maybeSingle();

  const equipe = (usuarios ?? []).filter((u) => u.tipo !== "cliente");

  return (
    <ClinicShell
      user={{ name: user.nome_completo ?? "Usuário", role: user.tipo }}
      aprovacoesPendentes={pendentes ?? 0}
      clinicaNome={clinica?.nome ?? "Clínica"}
      title="Usuários"
      sub={`${equipe.length} membros da equipe`}
      topRight={<Btn size="sm" icon="plus">Convidar membro</Btn>}
    >
      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface-2)" }}>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>Membro</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>Tipo</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {equipe.map((u, i) => (
              <tr key={u.id} style={{ borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                <td style={{ padding: "14px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar name={u.nome_completo ?? ""} size={36} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{u.nome_completo}</div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13 }}>
                  {u.tipo === "admin" ? "Administrador" : u.tipo === "profissional" ? "Profissional" : "Recepcionista"}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <Pill kind={u.ativo ? "ok" : "muted"}>{u.ativo ? "Ativo" : "Inativo"}</Pill>
                </td>
              </tr>
            ))}
            {equipe.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 48, textAlign: "center", color: "var(--ink-3)" }}>
                  Nenhum membro cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ClinicShell>
  );
}