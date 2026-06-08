import type { ReactNode } from "react";
import { TabBar } from "@/frontend/components/cliente/TabBar";
import styles from "./ClienteShell.module.css";

interface ClienteShellProps {
  children: ReactNode;
}

export function ClienteShell({ children }: ClienteShellProps) {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>{children}</main>
      <TabBar />
    </div>
  );
}