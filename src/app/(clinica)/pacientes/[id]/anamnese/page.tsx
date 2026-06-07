import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { userHasPermission } from "@/backend/lib/auth/permissions";
import { getPaciente } from "@/backend/services/pacienteService";
import {
  getAnamnese,
  getSecaoAsObject,
} from "@/backend/services/anamneseService";
import { AnamneseStepper } from "@/frontend/components/clinica/AnamneseStepper";
import { saveAnamneseAction } from "./actions";

interface PageProps {
  params: { id: string };
}

export default async function AnamnesePage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  const canVer = await userHasPermission(user, "ver_prontuario");
  if (!canVer) redirect("/dashboard");

  const paciente = await getPaciente(params.id);
  if (!paciente) notFound();

  const anamnese = await getAnamnese(params.id);
  const canEdit = await userHasPermission(user, "editar_prontuario");

  const initialData = {
    dados_gerais: getSecaoAsObject(anamnese, "dados_gerais"),
    saude: getSecaoAsObject(anamnese, "saude"),
    habitos: getSecaoAsObject(anamnese, "habitos"),
    contraindicacoes: getSecaoAsObject(anamnese, "contraindicacoes"),
  };

  const saveAction = saveAnamneseAction.bind(null, params.id);

  return (
    <div
      style={{
        padding: "32px clamp(20px, 4vw, 48px)",
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      <Link
        href={`/pacientes/${params.id}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "var(--ink-3)",
          textDecoration: "none",
          marginBottom: 16,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Voltar para o perfil
      </Link>

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
          Anamnese
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 6 }}>
          {paciente.nome_completo}
        </p>
      </header>

      <AnamneseStepper
        initialData={initialData}
        canEdit={canEdit}
        saveAction={saveAction}
      />
    </div>
  );
}