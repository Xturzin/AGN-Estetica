import type { ReactNode } from "react";
import { requireClient } from "@/backend/lib/auth/session";
import { ClienteShell } from "@/frontend/components/cliente/ClienteShell";

export default async function ClienteLayout({ children }: { children: ReactNode }) {
  await requireClient();
  return (
  <ClienteShell>
    {children}
  </ClienteShell>
);
}