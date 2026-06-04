import { LoginForm } from "@/frontend/components/auth/LoginForm";
import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
  return <LoginForm action={loginAdmin} title="Acesso do Administrador" subtitle="AGN Estética" />;
}