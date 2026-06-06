import type { ReactNode } from "react";
import { Logo } from "@/frontend/components/ui";
import styles from "./LoginShell.module.css";

export type LoginShellVariant = "default" | "admin";

interface LoginShellProps {
  variant?: LoginShellVariant;
  brandEyebrow: string;
  brandHeadline: string;
  brandLead: string;
  formBadge?: string;
  formTitle: string;
  formSubtitle?: string;
  formContent: ReactNode;
}

export function LoginShell({
  variant = "default",
  brandEyebrow,
  brandHeadline,
  brandLead,
  formBadge,
  formTitle,
  formSubtitle,
  formContent,
}: LoginShellProps) {
  return (
    <main className={styles.shell}>
      <aside className={styles.brandPanel} data-variant={variant}>
        <div className={styles.brandPanelGrid} />
        <div className={styles.brandLogo}>
          <Logo size={20} dark />
        </div>
        <div className={styles.brandContent}>
          <div className={styles.brandEyebrow}>{brandEyebrow}</div>
          <h2 className={styles.brandHeadline}>{brandHeadline}</h2>
          <p className={styles.brandLead}>{brandLead}</p>
        </div>
        <div className={styles.brandSpacer} />
      </aside>

      <section className={styles.formPanel}>
        <div className={styles.formInner}>
          {formBadge && (
            <div className={styles.formBadge}>
              <span className={styles.formBadgeDot} />
              {formBadge}
            </div>
          )}
          <h1 className={styles.formTitle}>{formTitle}</h1>
          {formSubtitle && <p className={styles.formSubtitle}>{formSubtitle}</p>}
          {formContent}
        </div>
      </section>
    </main>
  );
}