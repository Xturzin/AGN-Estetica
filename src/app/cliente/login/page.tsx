import { LoginForm } from "@/frontend/components/auth/LoginForm";
import { loginCliente } from "./actions";

export default function ClienteLoginPage() {
  return <LoginForm action={loginCliente} title="Área do Paciente" subtitle="AGN Estética" />;
}