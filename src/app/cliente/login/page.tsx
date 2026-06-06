import { LoginForm } from "@/frontend/components/auth/LoginForm";
import { Logo, PhoneShell } from "@/frontend/components/ui";
import { loginCliente } from "./actions";
import styles from "./login.module.css";

export default function ClienteLoginPage() {
  return (
    <PhoneShell bg="var(--accent-deep)">
      <div className={styles.shell}>
        <div className={styles.brandTop}>
          <div className={styles.brandGrid} />
          <div className={styles.brandContent}>
            <Logo size={18} dark />
            <h1 className={styles.brandHeadline}>Seu cuidado, na palma da mão.</h1>
            <p className={styles.brandLead}>
              Agende, acompanhe sua evolução e acesse seus documentos com a sua clínica.
            </p>
          </div>
        </div>

        <div className={styles.sheet}>
          <h2 className={styles.sheetTitle}>Entrar</h2>
          <p className={styles.sheetSubtitle}>Acesse sua conta para continuar.</p>
          <LoginForm action={loginCliente} />
        </div>
      </div>
    </PhoneShell>
  );
}