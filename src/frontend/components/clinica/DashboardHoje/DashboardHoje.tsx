import Link from "next/link";
import { Card } from "@/frontend/components/ui";
import type { DashboardHojeData } from "@/backend/services/dashboardService";
import styles from "./DashboardHoje.module.css";

interface DashboardHojeProps {
  data: DashboardHojeData;
  primeiroNome: string;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatHora(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function dataExtensa(): string {
  const d = new Date();
  const dias = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]}`;
}

const STATUS_COR: Record<string, string> = {
  agendado: "#8AA4C8",
  confirmado: "#7AA095",
  em_andamento: "#D9B26C",
  concluido: "#C9C2BC",
  cancelado: "#9B928B",
  falta: "#D08A8A",
};

const STATUS_LABEL: Record<string, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  em_andamento: "Em atendimento",
  concluido: "Concluído",
  cancelado: "Cancelado",
  falta: "Falta",
};

export function DashboardHoje({ data, primeiroNome }: DashboardHojeProps) {
  const { agendamentosHoje, atendimentoEmAndamento, aprovacoesPendentes, totalHoje, concluidos } = data;
  const proximoNaoConcluido = agendamentosHoje.find(
    (a) => a.status === "agendado" || a.status === "confirmado"
  );

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Oi {primeiroNome}.</h1>
          <p className={styles.dataExtensa}>{dataExtensa()}</p>
        </div>
        <Link href="/dashboard" className={styles.toggleBtn}>
          Versão geral
        </Link>
      </header>

      <div className={styles.kpis}>
        <KPI label="Hoje" value={totalHoje} />
        <KPI label="Concluídos" value={concluidos} accent="#7AA095" />
        <KPI
          label="Aprovações"
          value={aprovacoesPendentes}
          accent={aprovacoesPendentes > 0 ? "#D08A8A" : undefined}
          href="/aprovacoes"
        />
      </div>

      {atendimentoEmAndamento && (
        <Link href={`/atendimento/${atendimentoEmAndamento.id}`} className={styles.atendLink}>
          <Card>
            <div className={styles.atendCard}>
              <span className={styles.atendBadge}>EM ATENDIMENTO</span>
              <span className={styles.atendNome}>
                {atendimentoEmAndamento.paciente?.nome_completo ?? "—"}
              </span>
              <span className={styles.atendInfo}>
                {atendimentoEmAndamento.servico?.nome} · com {atendimentoEmAndamento.profissional?.nome_completo}
              </span>
            </div>
          </Card>
        </Link>
      )}

      {proximoNaoConcluido && !atendimentoEmAndamento && (
        <Card>
          <div className={styles.proximoCard}>
            <span className={styles.proximoLabel}>Próximo</span>
            <div className={styles.proximoBody}>
              <span className={styles.proximoHora}>{formatHora(proximoNaoConcluido.data_hora_inicio)}</span>
              <div className={styles.proximoInfo}>
                <span className={styles.proximoNome}>{proximoNaoConcluido.paciente?.nome_completo ?? "—"}</span>
                <span className={styles.proximoServico}>{proximoNaoConcluido.servico?.nome}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Agenda de hoje</h2>
        {agendamentosHoje.length === 0 ? (
          <Card>
            <div className={styles.empty}>Sem agendamentos hoje.</div>
          </Card>
        ) : (
          <Card>
            <div className={styles.agendaList}>
              {agendamentosHoje.map((a) => (
                <div key={a.id} className={styles.agendaItem}>
                  <div className={styles.agendaHora}>
                    <span>{formatHora(a.data_hora_inicio)}</span>
                  </div>
                  <div
                    className={styles.agendaDot}
                    style={{ background: a.profissional?.cor_agenda ?? "#888" }}
                  />
                  <div className={styles.agendaBody}>
                    <span className={styles.agendaNome}>{a.paciente?.nome_completo ?? "—"}</span>
                    <span className={styles.agendaServico}>
                      {a.servico?.nome} · {a.profissional?.nome_completo?.split(" ")[0]}
                    </span>
                  </div>
                  <span
                    className={styles.agendaStatus}
                    style={{ background: `${STATUS_COR[a.status]}33`, color: STATUS_COR[a.status] }}
                  >
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}

function KPI({ label, value, accent, href }: { label: string; value: number; accent?: string; href?: string }) {
  const content = (
    <div className={styles.kpiBox}>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={styles.kpiValue} style={{ color: accent }}>{value}</span>
    </div>
  );
  if (href) {
    return <Link href={href} className={styles.kpiLink}>{content}</Link>;
  }
  return <div className={styles.kpiStatic}>{content}</div>;
}