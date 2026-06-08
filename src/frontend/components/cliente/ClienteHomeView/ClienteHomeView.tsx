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

function formatDateLong(iso: string): string {
  const d = new Date(iso);
  const dias = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]}`;
}

function formatHora(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getSaudacao(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function ClienteHomeView({ paciente, proximo, servicos }: ClienteHomeViewProps) {
  const primeiro = paciente.nome_completo.split(" ")[0];

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <span className={styles.saudacao}>{getSaudacao()},</span>
        <h1 className={styles.nome}>{primeiro}</h1>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Próxima consulta</h2>
        {proximo ? (
          <div className={styles.proximoCard}>
            <div className={styles.proximoDateBox}>
              <span className={styles.proximoDia}>{new Date(proximo.data_hora_inicio).getDate()}</span>
              <span className={styles.proximoMes}>
                {["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][new Date(proximo.data_hora_inicio).getMonth()]}
              </span>
            </div>
            <div className={styles.proximoInfo}>
              <span className={styles.proximoData}>{formatDateLong(proximo.data_hora_inicio)}</span>
              <span className={styles.proximoHora}>às {formatHora(proximo.data_hora_inicio)}</span>
              <span className={styles.proximoServico}>{proximo.servico?.nome ?? "—"}</span>
              {proximo.profissional && (
                <span className={styles.proximoProf}>com {proximo.profissional.nome_completo}</span>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.empty}>
            <p>Você não tem agendamentos marcados.</p>
            <Link href="/cliente/agendar" className={styles.emptyBtn}>
              Solicitar agendamento
            </Link>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Ações rápidas</h2>
        <div className={styles.acoesGrid}>
          <Link href="/cliente/agendar" className={styles.acaoCard}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9 H21 M8 3 V7 M16 3 V7 M12 13 V17 M10 15 H14" />
            </svg>
            <span>Agendar</span>
          </Link>
          <Link href="/cliente/historico" className={styles.acaoCard}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <span>Histórico</span>
          </Link>
        </div>
      </section>

      {servicos.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Serviços disponíveis</h2>
          <div className={styles.servicosList}>
            {servicos.map((s) => (
              <div key={s.id} className={styles.servicoItem}>
                <span className={styles.servicoDot} style={{ background: s.cor ?? "var(--accent-deep)" }} />
                <div className={styles.servicoBody}>
                  <span className={styles.servicoNome}>{s.nome}</span>
                  <span className={styles.servicoDuracao}>{s.duracao_minutos} min</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}