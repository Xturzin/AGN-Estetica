import { LoginClinica } from "@/frontend/components/screens/clinica/LoginClinica";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  return <LoginClinica loginAction={loginAction} />;
}