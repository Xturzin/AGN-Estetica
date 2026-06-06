import { LoginForm } from "@/frontend/components/auth/LoginForm";
import { LoginShell } from "@/frontend/components/auth/LoginShell";
import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
  return (
    <LoginShell
      variant="admin"
      brandEyebrow="Painel administrativo"
      brandHeadline="Acesso restrito ao gestor da clínica."
      brandLead="Esta área é reservada ao administrador principal. Configurações, equipe, permissões e dados sensíveis ficam aqui."
      formBadge="Acesso administrativo"
      formTitle="Acesso do administrador"
      formSubtitle="Apenas o gestor principal pode acessar esta área."
      formContent={<LoginForm action={loginAdmin} />}
    />
  );
}