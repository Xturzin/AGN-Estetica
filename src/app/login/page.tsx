import { LoginClinica } from "@/frontend/components/screens/clinica/LoginClinica";
import { loginAction } from "./actions";

export default function LoginPage() {
  return <LoginClinica loginAction={loginAction} />;
}