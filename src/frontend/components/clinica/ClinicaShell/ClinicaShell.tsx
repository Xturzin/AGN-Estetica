import type { ReactNode } from "react";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { Sidebar } from "@/frontend/components/clinica/Sidebar";
import { ClinicaTopBar } from "@/frontend/components/clinica/ClinicaTopBar";
import styles from "./ClinicaShell.module.css";

interface ClinicaShellProps {
  children: ReactNode;
  aprovacoesPendentes?: number;
}

export async function ClinicaShell({ children, aprovacoesPendentes = 0 }: ClinicaShellProps) {
  const user = await getCurrentUser();
  const isAdmin = user?.tipo === "admin";

  return (
    <div className={styles.shell}>
      <Sidebar isAdmin={isAdmin} aprovacoesPendentes={aprovacoesPendentes} />
      <div className={styles.main}>
        <ClinicaTopBar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}