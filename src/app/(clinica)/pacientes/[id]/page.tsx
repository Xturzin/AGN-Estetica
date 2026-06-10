import { notFound } from "next/navigation";
import { getPerfilPacienteCompleto } from "@/backend/services/pacienteService";
import { PerfilPacienteView } from "@/frontend/components/clinica/PerfilPacienteView";

interface PageProps {
  params: { id: string };
}

export default async function PerfilPacientePage({ params }: PageProps) {
  const data = await getPerfilPacienteCompleto(params.id);
  if (!data) notFound();
  return <PerfilPacienteView data={data} />;
}