import { requirePermission } from "@/backend/lib/auth/permissions";
import {
  listServicos,
  listCategorias,
} from "@/backend/services/servicoService";
import { ServicoList } from "@/frontend/components/clinica/ServicoList";
import {
  createServicoAction,
  updateServicoAction,
  toggleAtivoServicoAction,
} from "./actions";

interface PageProps {
  searchParams: { inativos?: string };
}

export default async function ServicosPage({ searchParams }: PageProps) {
  await requirePermission("gerenciar_servicos");

  const showInativos = searchParams.inativos === "1";
  const [servicos, categorias] = await Promise.all([
    listServicos(showInativos),
    listCategorias(),
  ]);

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
          Serviços
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 6 }}>
          Cadastro de procedimentos oferecidos pela clínica.
        </p>
      </header>

      <ServicoList
        servicos={servicos}
        categorias={categorias}
        showInativos={showInativos}
        createAction={createServicoAction}
        updateAction={updateServicoAction}
        toggleAtivoAction={toggleAtivoServicoAction}
      />
    </div>
  );
}