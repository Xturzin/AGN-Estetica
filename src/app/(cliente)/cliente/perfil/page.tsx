import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { getPacienteDoUsuario } from "@/backend/services/clienteContextService";
import { getAnamnese } from "@/backend/services/anamneseService";
import { listDocumentosPaciente } from "@/backend/services/documentoService";
import { ClientePerfilView } from "@/frontend/components/cliente/ClientePerfilView";
import { logoutClienteAction } from "./actions";

export default async function ClientePerfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/cliente/login");
  if (user.tipo !== "cliente") redirect("/dashboard");

  const paciente = await getPacienteDoUsuario(user.id);
  if (!paciente) redirect("/cliente/home");

  const [anamnese, documentos] = await Promise.all([
    getAnamnese(paciente.id),
    listDocumentosPaciente(paciente.id),
  ]);

  return (
    <ClientePerfilView
      paciente={paciente}
      email={user.email ?? paciente.email}
      anamnesePreenchida={anamnese !== null}
      documentos={documentos}
      logoutAction={logoutClienteAction}
    />
  );
}