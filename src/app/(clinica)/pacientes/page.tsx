import { listPacientes } from "@/backend/services/pacienteService";
import { PacientesView } from "@/frontend/components/clinica/PacientesView";

export default async function PacientesPage() {
  const pacientes = await listPacientes();
  return <PacientesView pacientes={pacientes} />;
}