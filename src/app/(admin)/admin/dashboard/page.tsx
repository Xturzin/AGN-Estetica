import { getCurrentUser } from "@/backend/lib/auth/session";
import { logoutAction } from "@/backend/services/authActions";
import { Button } from "@/frontend/components/ui";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  return (
    <main style={{ padding: 40 }}>
      <h1>Admin Dashboard</h1>
      <p>
        Logado como: <strong>{user?.nome_completo}</strong> ({user?.email})
      </p>
      <p>Tipo: {user?.tipo}</p>
      <form action={logoutAction} style={{ marginTop: 24 }}>
        <Button type="submit" variant="ghost">
          Sair
        </Button>
      </form>
    </main>
  );
}