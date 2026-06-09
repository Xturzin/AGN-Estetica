import Link from "next/link";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { listMinhasNotificacoes } from "@/backend/services/notificacaoService";
import { NotificacaoBell } from "@/frontend/components/clinica/NotificacaoBell";
import { marcarLidaAction, marcarTodasLidasAction, logoutAction } from "@/app/(clinica)/header-actions";
import styles from "./ClinicaHeader.module.css";

export async function ClinicaHeader() {
  const user = await getCurrentUser();
  if (!user) return null;

  const inicial = user.nome_completo?.[0]?.toUpperCase() ?? "U";
  const primeiro = user.nome_completo?.split(" ")[0] ?? "Usuário";
  const notificacoes = await listMinhasNotificacoes(user.id, 20);
  const isAdmin = user.tipo === "admin";
  const homeHref = isAdmin ? "/admin/dashboard" : "/dashboard";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={homeHref} className={styles.brand}>
          AGN Estética
          {isAdmin && <span className={styles.badgeAdmin}>Admin</span>}
        </Link>

        <nav className={styles.nav}>
          {!isAdmin && (
            <>
              <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
              <Link href="/agenda" className={styles.navLink}>Agenda</Link>
              <Link href="/aprovacoes" className={styles.navLink}>Aprovações</Link>
              <Link href="/pacientes" className={styles.navLink}>Pacientes</Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
              <Link href="/agenda" className={styles.navLink}>Agenda</Link>
              <Link href="/aprovacoes" className={styles.navLink}>Aprovações</Link>
              <Link href="/pacientes" className={styles.navLink}>Pacientes</Link>
              <Link href="/usuarios" className={styles.navLink}>Equipe</Link>
              <Link href="/configuracoes" className={styles.navLink}>Config</Link>
            </>
          )}
        </nav>

        <div className={styles.right}>
          <NotificacaoBell
            userId={user.id}
            initial={notificacoes}
            marcarLidaAction={marcarLidaAction}
            marcarTodasLidasAction={marcarTodasLidasAction}
          />
          <div className={styles.userBox}>
            <span className={styles.avatar}>{inicial}</span>
            <span className={styles.userName}>{primeiro}</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className={styles.logoutBtn}>Sair</button>
          </form>
        </div>
      </div>
    </header>
  );
}