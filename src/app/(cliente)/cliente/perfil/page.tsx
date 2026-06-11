import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { PerfilDoCliente } from "@/frontend/components/screens/cliente/PerfilDoCliente";
import { logoutAction } from "@/app/(clinica)/header-actions";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/cliente/login");
  return <PerfilDoCliente nome={user.nome_completo ?? "Paciente"} email={user.email ?? ""} logoutAction={logoutAction} />;
}