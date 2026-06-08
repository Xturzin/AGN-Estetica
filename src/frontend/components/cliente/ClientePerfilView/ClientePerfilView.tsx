"use client";

import type { Paciente } from "@/backend/services/pacienteService";
import type { DocumentoComUrl } from "@/backend/services/documentoService";
import styles from "./ClientePerfilView.module.css";

interface ClientePerfilViewProps {
  paciente: Paciente;
  email: string | null;
  anamnesePreenchida: boolean;
  documentos: DocumentoComUrl[];
  logoutAction: () => Promise<void>;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const DOC_LABELS: Record<string, string> = {
  termo_consentimento: "Termo",
  exame: "Exame",
  receita: "Receita",
  outro: "Outro",
};

function openDoc(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function ClientePerfilView({ paciente, email, anamnesePreenchida, documentos, logoutAction }: ClientePerfilViewProps) {
  const inicial = paciente.nome_completo[0]?.toUpperCase() ?? "?";

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.avatar}>{inicial}</div>
        <h1 className={styles.nome}>{paciente.nome_completo}</h1>
        {email && <span className={styles.email}>{email}</span>}
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Meus dados</h2>
        <div className={styles.dataList}>
          <DataRow label="Telefone" value={paciente.telefone} />
          <DataRow label="Email" value={paciente.email} />
          <DataRow label="Endereço" value={paciente.logradouro ? `${paciente.logradouro}${paciente.bairro ? `, ${paciente.bairro}` : ""}` : null} />
          <DataRow label="Cidade" value={paciente.cidade ? `${paciente.cidade}${paciente.estado ? ` / ${paciente.estado}` : ""}` : null} />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Anamnese</h2>
        {anamnesePreenchida ? (
          <div className={styles.statusOk}>
            <span className={styles.statusDot} />
            <div>
              <strong>Preenchida</strong>
              <p>Suas informações de saúde estão registradas com a clínica.</p>
            </div>
          </div>
        ) : (
          <div className={styles.statusPendente}>
            <span className={styles.statusDot} style={{ background: "var(--warn-ink)" }} />
            <div>
              <strong>Pendente</strong>
              <p>Solicite à clínica para preencher na próxima visita.</p>
            </div>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Documentos</h2>
        {documentos.length === 0 ? (
          <div className={styles.empty}>Nenhum documento ainda.</div>
        ) : (
          <div className={styles.docList}>
            {documentos.map((d) => (
              <div key={d.id} className={styles.docItem}>
                <div className={styles.docInfo}>
                  <span className={styles.docNome}>{d.nome}</span>
                  <span className={styles.docMeta}>{DOC_LABELS[d.tipo] ?? d.tipo} · {formatBytes(d.tamanho_bytes ?? 0)}</span>
                </div>
                {d.signed_url && (
                  <button type="button" onClick={() => openDoc(d.signed_url as string)} className={styles.docBtn}>Abrir</button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <form action={logoutAction} className={styles.logoutForm}>
        <button type="submit" className={styles.logoutBtn}>Sair</button>
      </form>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className={styles.dataRow}>
      <span className={styles.dataLabel}>{label}</span>
      <span className={styles.dataValue}>{value || "—"}</span>
    </div>
  );
}