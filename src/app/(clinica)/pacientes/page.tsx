import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { listPacientes } from "@/backend/services/pacienteService";
import { PacienteList } from "@/frontend/components/clinica/PacienteList";
import {
  createPacienteAction,
  updatePacienteAction,
  toggleAtivoPacienteAction,
} from "./actions";

interface PageProps {
  searchParams: { inativos?: string };
}

export default async function PacientesPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  const showInativos = searchParams.inativos === "1";
  const pacientes = await listPacientes(showInativos);

  return (
    <div
      style={{
        padding: "32px clamp(20px, 4vw, 48px)",
        maxWidth: 1120,
        margin: "0 auto",
      }}
    >
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
          Pacientes
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 6 }}>
          Cadastro e prontuário dos pacientes da clínica.
        </p>
      </header>

      <PacienteList
        pacientes={pacientes}
        showInativos={showInativos}
        createAction={createPacienteAction}
        updateAction={updatePacienteAction}
        toggleAtivoAction={toggleAtivoPacienteAction}
      />
    </div>
  );
}