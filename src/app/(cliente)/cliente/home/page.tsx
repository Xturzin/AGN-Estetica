import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { HomeDoCliente } from "@/frontend/components/screens/cliente/HomeDoCliente";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/cliente/login");
  if (user.tipo !== "cliente") redirect("/dashboard");
  const primeiro = (user.nome_completo ?? "").split(" ")[0];
  return <HomeDoCliente primeiroNome={primeiro} />;
}