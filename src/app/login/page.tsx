import { LoginForm } from "@/frontend/components/auth/LoginForm";
import { loginClinica } from "./actions";

export default function LoginPage() {
  return <LoginForm action={loginClinica} title="Equipe da Clínica" subtitle="AGN Estética" />;
}