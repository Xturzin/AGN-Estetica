import { getCurrentUser } from "@/backend/lib/auth/session";
import { listMinhasNotificacoes } from "@/backend/services/notificacaoService";
import { NotificacaoBell } from "@/frontend/components/clinica/NotificacaoBell";
import { marcarLidaAction, marcarTodasLidasAction, logoutAction } from "@/app/(clinica)/header-actions";
import styles from "./ClinicaTopBar.module.css";

export async function ClinicaTopBar() {
  const user = await getCurrentUser();
  if (!user) return null;

  const inicial = user.nome_completo?.[0]?.toUpperCase() ?? "U";
  const nome = user.nome_completo ?? "Usuário";
  const cargo =
    user.tipo === "admin" ? "Administradora"
    : user.tipo === "profissional" ? "Profissional"
    : "Recepcionista";
  const notificacoes = await listMinhasNotificacoes(user.id, 20);

  return (
    <header className={styles.topbar}>
      <div className={styles.right}>
        <NotificacaoBell
          userId={user.id}
          initial={notificacoes}
          marcarLidaAction={marcarLidaAction}
          marcarTodasLidasAction={marcarTodasLidasAction}
        />
        <div className={styles.userBox}>
          <div className={styles.avatar}>{inicial}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{nome}</span>
            <span className={styles.userCargo}>{cargo}</span>
          </div>
        </div>
        <form action={logoutAction}>
          <button type="submit" className={styles.logoutBtn} title="Sair">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}