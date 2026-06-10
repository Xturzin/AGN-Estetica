import type { ReactNode } from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  eyebrow?: string;
  titulo: string;
  subtitulo?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, titulo, subtitulo, actions }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.titulo}>{titulo}</h1>
        {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}