import type { ReactNode } from "react";
import { requireAdmin } from "@/backend/lib/auth/session";
import { ClinicaShell } from "@/frontend/components/clinica/ClinicaShell";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";

async function getAprovacoesPendentes(): Promise<number> {
  const supabase = createServerSupabaseClient();
  const { count } = await supabase
    .from("aprovacoes")
    .select("*", { count: "exact", head: true })
    .eq("status", "pendente");
  return count ?? 0;
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const pendentes = await getAprovacoesPendentes();
  return (
    <ClinicaShell aprovacoesPendentes={pendentes}>
      {children}
    </ClinicaShell>
  );
}