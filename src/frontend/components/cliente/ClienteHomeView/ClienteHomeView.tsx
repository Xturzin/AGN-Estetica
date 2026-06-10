import Link from "next/link";
import type { Paciente } from "@/backend/services/pacienteService";
import type { AgendamentoComRefs, ServicoRef } from "@/backend/services/agendamentoService";
import styles from "./ClienteHomeView.module.css";

interface ClienteHomeViewProps {
  paciente: Paciente;
  proximo: AgendamentoComRefs | null;
  servicos: ServicoRef[];
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatDataPill(iso: string): string {
  const d = new Date(iso);
  const dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d.getDate()} ${meses[d.getMonth()]}, ${dias[d.getDay()]}`;
}

function formatHora(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const STATUS_LABEL: Record<string, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  em_andamento: "Em atendimento",
};

export function ClienteHomeView({ paciente, proximo, servicos }: ClienteHomeViewProps) {
  const primeiro = paciente.nome_completo.split(" ")[0];

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <span className={styles.saudacao}>Olá,</span>
          <h1 className={styles.nome}>{primeiro}</h1>
        </div>
        <Link href="/cliente/perfil" className={styles.belBtn} aria-label="Notificações">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className={styles.belDot} />
        </Link>
      </header>

      {proximo ? (
        <div className={styles.proximoCard}>
          <div className={styles.proximoTop}>
            <span className={styles.proximoLabel}>PRÓXIMO AGENDAMENTO</span>
            <span className={styles.proximoStatus}>
              {STATUS_LABEL[proximo.status] ?? "Agendado"}
            </span>
          </div>

          <h2 className={styles.proximoTitulo}>{proximo.servico?.nome ?? "Atendimento"}</h2>

          <div className={styles.proximoMeta}>
            <span className={styles.proximoMetaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {formatDataPill(proximo.data_hora_inicio)}
            </span>
            <span className={styles.proximoMetaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {formatHora(proximo.data_hora_inicio)}
            </span>
          </div>

          <div className={styles.proximoActions}>
            <Link href="/cliente/historico" className={styles.btnPrimary}>Ver detalhes</Link>
            <Link href="/cliente/agendar" className={styles.btnGhost}>Reagendar</Link>
          </div>
        </div>
      ) : (
        <div className={styles.emptyCard}>
          <span className={styles.emptyLabel}>PRÓXIMO AGENDAMENTO</span>
          <p className={styles.emptyText}>Você não tem agendamentos marcados.</p>
          <Link href="/cliente/agendar" className={styles.btnPrimary}>Solicitar agendamento</Link>
        </div>
      )}

      <div className={styles.acoes}>
        <Link href="/cliente/agendar" className={styles.acaoCard}>
          <span className={styles.acaoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <line x1="12" y1="14" x2="12" y2="18"/>
              <line x1="10" y1="16" x2="14" y2="16"/>
            </svg>
          </span>
          <span className={styles.acaoLabel}>Agendar</span>
        </Link>
        <Link href="/cliente/historico" className={styles.acaoCard}>
          <span className={styles.acaoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          <span className={styles.acaoLabel}>Histórico</span>
        </Link>
        <Link href="/cliente/perfil" className={styles.acaoCard}>
          <span className={styles.acaoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </span>
          <span className={styles.acaoLabel}>Documentos</span>
        </Link>
      </div>

      {servicos.length > 0 && (
        <section className={styles.servicosSec}>
          <div className={styles.servicosHead}>
            <h3 className={styles.servicosTitle}>Serviços disponíveis</h3>
            <Link href="/cliente/agendar" className={styles.linkVerTodos}>Ver todos</Link>
          </div>

          <div className={styles.servicosScroll}>
            {servicos.map((s) => (
              <Link key={s.id} href="/cliente/agendar" className={styles.servicoCard}>
                <div className={styles.servicoFoto}>
                  <span className={styles.servicoFotoLabel}>foto</span>
                </div>
                <div className={styles.servicoBody}>
                  <span className={styles.servicoNome}>{s.nome}</span>
                  <span className={styles.servicoMeta}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {s.duracao_minutos < 60 ? `${s.duracao_minutos} min` : `${Math.floor(s.duracao_minutos / 60)}h${s.duracao_minutos % 60 ? ` ${s.duracao_minutos % 60}min` : ""}`}
                  </span>
                  <div className={styles.servicoFooter}>
                    <span className={styles.servicoPreco}>
                      {s.preco ? (
                        <>
                          <small>R$</small> {Number(s.preco).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </>
                      ) : "—"}
                    </span>
                    <span className={styles.servicoBtn}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}