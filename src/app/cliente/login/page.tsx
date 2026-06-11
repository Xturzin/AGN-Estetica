import { LoginCliente } from "@/frontend/components/screens/cliente/LoginCliente";
import { loginAction } from "./actions";

export default function Page() {
  return <LoginCliente loginAction={loginAction} />;
}