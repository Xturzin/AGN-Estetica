import { requireAdmin } from "@/backend/lib/auth/permissions";
import {
  listPermissoesMatrix,
  PERFIS_EDITAVEIS,
  AREAS_EDITAVEIS,
  PERMISSION_LABELS,
  PERFIL_LABELS,
} from "@/backend/services/permissoesService";
import { PermissoesMatrix } from "@/frontend/components/clinica/PermissoesMatrix";
import { togglePermissaoAction } from "./actions";

export default async function PermissoesPage() {
  await requireAdmin();

  const rawMatrix = await listPermissoesMatrix();

  const initialMatrix: Record<string, Record<string, { habilitado: boolean }>> = {};
  PERFIS_EDITAVEIS.forEach((perfil) => {
    initialMatrix[perfil] = {};
    AREAS_EDITAVEIS.forEach((area) => {
      initialMatrix[perfil][area] = {
        habilitado: rawMatrix[perfil]?.[area] ?? false,
      };
    });
  });

  const perfis = PERFIS_EDITAVEIS.map((id) => ({
    id,
    label: PERFIL_LABELS[id],
  }));
  const areas = AREAS_EDITAVEIS.map((id) => ({
    id,
    label: PERMISSION_LABELS[id],
  }));

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
          Permissões
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 6 }}>
          Defina o que cada perfil da equipe pode fazer no sistema.
        </p>
      </header>

      <PermissoesMatrix
        initialMatrix={initialMatrix}
        perfis={perfis}
        areas={areas}
        toggleAction={togglePermissaoAction}
      />
    </div>
  );
}