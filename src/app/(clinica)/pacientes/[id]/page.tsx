import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { getPaciente } from "@/backend/services/pacienteService";
import { PacienteHeader } from "@/frontend/components/clinica/PacienteHeader";
import { PacienteTabs } from "@/frontend/components/clinica/PacienteTabs";

interface PageProps {
  params: { id: string };
}

export default async function PacientePerfilPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  const paciente = await getPaciente(params.id);
  if (!paciente) notFound();

  return (
    <div
      style={{
        padding: "32px clamp(20px, 4vw, 48px)",
        maxWidth: 1120,
        margin: "0 auto",
      }}
    >
      <PacienteHeader paciente={paciente} />
      <PacienteTabs paciente={paciente} />
    </div>
  );
}