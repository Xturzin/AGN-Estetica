"use client";

import { useState } from "react";
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

const STATUS_LABEL: Record<string, string> = {
  ativo: "Ativo",
  em_tratamento: "Em tratamento",
  inativo: "Inativo",
  novo: "Novo",
};

const STATUS_COR: Record<string, { bg: string; fg: string }> = {
  ativo: { bg: "var(--success-tint)", fg: "var(--success)" },
  em_tratamento: { bg: "var(--warn-tint)", fg: "var(--warn)" },
  inativo: { bg: "var(--surface-3)", fg: "var(--ink-3)" },
  novo: { bg: "var(--brand-tint)", fg: "var(--brand-deep)" },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mesAno(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  return `${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

function openDoc(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

type RowId = "dados" | "anamnese" | "documentos" | "notificacoes" | "privacidade";

export function ClientePerfilView({ paciente, email, anamnesePreenchida, documentos, logoutAction }: ClientePerfilViewProps) {
  const [aberto, setAberto] = useState<RowId | null>(null);

  function toggle(id: RowId) {
    setAberto(aberto === id ? null : id);
  }

  const inicial = paciente.nome_completo[0]?.toUpperCase() ?? "?";
  const statusKey = paciente.status ?? "ativo";
  const statusCor = STATUS_COR[statusKey] ?? STATUS_COR.ativo;
  const statusLabel = STATUS_LABEL[statusKey] ?? statusKey;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          <span className={styles.avatarLetra}>{inicial}</span>
        </div>
        <h1 className={styles.nome}>{paciente.nome_completo}</h1>
        <p className={styles.desde}>Cliente desde {mesAno(paciente.created_at)}</p>
        <span className={styles.statusPill} style={{ background: statusCor.bg, color: statusCor.fg }}>
          • {statusLabel}
        </span>
      </header>

      <div className={styles.rows}>
        <Row
          id="dados"
          aberto={aberto === "dados"}
          onToggle={toggle}
          icon={<IconUser />}
          titulo="Dados pessoais"
          subtitulo="Nome, contato, endereço"
        >
          <DataLine label="Nome" value={paciente.nome_completo} />
          <DataLine label="Email" value={email || paciente.email} />
          <DataLine label="Telefone" value={paciente.telefone} />
          <DataLine
            label="Endereço"
            value={paciente.logradouro ? `${paciente.logradouro}${paciente.bairro ? `, ${paciente.bairro}` : ""}` : null}
          />
          <DataLine
            label="Cidade"
            value={paciente.cidade ? `${paciente.cidade}${paciente.estado ? ` / ${paciente.estado}` : ""}` : null}
          />
        </Row>

        <Row
          id="anamnese"
          aberto={aberto === "anamnese"}
          onToggle={toggle}
          icon={<IconClipboard />}
          titulo="Minha anamnese"
          subtitulo={anamnesePreenchida ? "Ficha de saúde" : "Ainda não preenchida"}
        >
          {anamnesePreenchida ? (
            <p className={styles.detailText}>
              Sua ficha de saúde está registrada com a clínica. Para alterações, fale diretamente com a equipe.
            </p>
          ) : (
            <p className={styles.detailText}>
              A anamnese ainda não foi preenchida. Solicite à clínica para preencher na próxima visita.
            </p>
          )}
        </Row>

        <Row
          id="documentos"
          aberto={aberto === "documentos"}
          onToggle={toggle}
          icon={<IconFolder />}
          titulo="Documentos compartilhados"
          subtitulo={`${documentos.length} arquivo${documentos.length === 1 ? "" : "s"}`}
        >
          {documentos.length === 0 ? (
            <p className={styles.detailText}>Nenhum documento ainda.</p>
          ) : (
            <div className={styles.docList}>
              {documentos.map((d) => (
                <div key={d.id} className={styles.docItem}>
                  <div className={styles.docInfo}>
                    <span className={styles.docNome}>{d.nome}</span>
                    <span className={styles.docMeta}>{formatBytes(d.tamanho_bytes ?? 0)}</span>
                  </div>
                  {d.signed_url && (
                    <button type="button" onClick={() => openDoc(d.signed_url as string)} className={styles.docBtn}>
                      Abrir
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Row>

        <Row
          id="notificacoes"
          aberto={aberto === "notificacoes"}
          onToggle={toggle}
          icon={<IconBell />}
          titulo="Notificações"
          subtitulo="Lembretes e avisos"
        >
          <p className={styles.detailText}>
            Você receberá notificações por email sobre confirmações, lembretes e atualizações dos seus agendamentos.
          </p>
        </Row>

        <Row
          id="privacidade"
          aberto={aberto === "privacidade"}
          onToggle={toggle}
          icon={<IconLock />}
          titulo="Privacidade e segurança"
        >
          <p className={styles.detailText}>
            Seus dados são tratados conforme a LGPD. Para solicitar exclusão de dados, entre em contato com a clínica.
          </p>
        </Row>
      </div>

      <form action={logoutAction} className={styles.logoutForm}>
        <button type="submit" className={styles.logoutBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair da conta
        </button>
      </form>

      <p className={styles.versao}>AGN Estética · versão 1.0.0</p>
    </div>
  );
}

function Row({ id, aberto, onToggle, icon, titulo, subtitulo, children }: { id: RowId; aberto: boolean; onToggle: (id: RowId) => void; icon: React.ReactNode; titulo: string; subtitulo?: string; children: React.ReactNode }) {
  return (
    <div className={`${styles.row} ${aberto ? styles.rowOpen : ""}`}>
      <button type="button" onClick={() => onToggle(id)} className={styles.rowHead}>
        <span className={styles.rowIcon}>{icon}</span>
        <div className={styles.rowText}>
          <span className={styles.rowTitulo}>{titulo}</span>
          {subtitulo && <span className={styles.rowSubtitulo}>{subtitulo}</span>}
        </div>
        <span className={styles.rowChevron}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </span>
      </button>
      {aberto && <div className={styles.rowDetail}>{children}</div>}
    </div>
  );
}

function DataLine({ label, value }: { label: string; value: string | null }) {
  return (
    <div className={styles.dataLine}>
      <span className={styles.dataLabel}>{label}</span>
      <span className={styles.dataValue}>{value || "—"}</span>
    </div>
  );
}

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconClipboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
  </svg>
);
const IconFolder = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);