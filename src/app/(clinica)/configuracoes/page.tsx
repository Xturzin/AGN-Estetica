import { requirePermission } from "@/backend/lib/auth/permissions";
import { getClinica } from "@/backend/services/clinicaService";
import { ClinicaForm } from "@/frontend/components/clinica/ClinicaForm";
import { updateClinicaAction } from "./actions";

export default async function ConfiguracoesPage() {
  await requirePermission("editar_configuracoes");
  const clinica = await getClinica();

  if (!clinica) {
    return (
      <div style={{ padding: 32, maxWidth: 880, margin: "0 auto" }}>
        <h1>Configurações</h1>
        <p>Clínica não encontrada. Contate o administrador do sistema.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px clamp(20px, 4vw, 48px)", maxWidth: 880, margin: "0 auto" }}>
      <header style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Configurações da clínica
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 6 }}>
          Dados gerais, contato, endereço, horário e identidade visual.
        </p>
      </header>
      <ClinicaForm clinica={clinica} action={updateClinicaAction} />
    </div>
  );
}