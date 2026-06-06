import { requirePermission } from "@/backend/lib/auth/permissions";
import { listEquipe } from "@/backend/services/usuarioService";
import { UsuarioList } from "@/frontend/components/clinica/UsuarioList";
import {
  inviteUsuarioAction,
  updateUsuarioAction,
  toggleAtivoUsuarioAction,
} from "./actions";

interface PageProps {
  searchParams: { inativos?: string };
}

export default async function UsuariosPage({ searchParams }: PageProps) {
  await requirePermission("gerenciar_usuarios");

  const showInativos = searchParams.inativos === "1";
  const usuarios = await listEquipe(showInativos);

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
          Equipe
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 6 }}>
          Membros da clínica com acesso ao sistema. Convide profissionais e recepcionistas.
        </p>
      </header>

      <UsuarioList
        usuarios={usuarios}
        showInativos={showInativos}
        inviteAction={inviteUsuarioAction}
        updateAction={updateUsuarioAction}
        toggleAtivoAction={toggleAtivoUsuarioAction}
      />
    </div>
  );
}