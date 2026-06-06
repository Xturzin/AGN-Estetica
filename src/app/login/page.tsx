import { LoginForm } from "@/frontend/components/auth/LoginForm";
import { LoginShell } from "@/frontend/components/auth/LoginShell";
import { loginClinica } from "./actions";

export default function LoginPage() {
  return (
    <LoginShell
      brandEyebrow="Plataforma de gestão clínica"
      brandHeadline="O cuidado da sua paciente, organizado num só lugar."
      brandLead="Agenda, prontuário e evolução clínica reunidos numa experiência pensada para o dia a dia da sua clínica."
      formTitle="Acesse sua conta"
      formSubtitle="Bem-vinda de volta. Entre para continuar."
      formContent={<LoginForm action={loginClinica} />}
    />
  );
}