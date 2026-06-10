import Link from "next/link";
import { PageHeader } from "@/frontend/components/clinica/PageHeader";
import type { DashboardCompletoData } from "@/backend/services/dashboardService";
import styles from "./DashboardCompleto.module.css";

interface DashboardCompletoProps {
  data: DashboardCompletoData;
  primeiroNome: string;
  aprovarAction: (formData: FormData) => Promise<void>;
  recusarAction: (formData: FormData) => Promise<void>;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
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

function dataExtensa(): string {
  const d = new Date();
  const dias = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
  const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  return `${dias[d.getDay()]}, ${d.getDate()} DE ${meses[d.getMonth()]}`;
}

const STATUS_COR: Record<string, { bg: string; fg: string; label: string }> = {
  agendado: { bg: "var(--brand-tint)", fg: "var(--brand-deep)", label: "Agendado" },
  confirmado: { bg: "var(--success-tint)", fg: "var(--success)", label: "Confirmado" },
  em_andamento: { bg: "var(--warn-tint)", fg: "var(--warn)", label: "Em atendimento" },
  concluido: { bg: "var(--surface-3)", fg: "var(--ink-3)", label: "Concluído" },
  cancelado: { bg: "var(--surface-3)", fg: "var(--ink-3)", label: "Cancelado" },
  falta: { bg: "var(--danger-tint)", fg: "var(--danger)", label: "Falta" },
};

function inicial(nome: string): string {
  const p = nome.trim().split(" ").filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0][0]?.toUpperCase() ?? "?";
  return ((p[0][0] ?? "") + (p[p.length - 1][0] ?? "")).toUpperCase();
}

export function DashboardCompleto({ data, primeiroNome, aprovarAction, recusarAction }: DashboardCompletoProps) {
  const { kpis, agendaHoje, aprovacoes } = data;

  return (
    <div>
      <PageHeader
        eyebrow={dataExtensa()}
        titulo={`${getSaudacao()}, ${primeiroNome}`}
        subtitulo={`Você tem ${kpis.atendimentosHoje} atendimento${kpis.atendimentosHoje === 1 ? "" : "s"} hoje e ${kpis.aprovacoesPendentes} solicitaç${kpis.aprovacoesPendentes === 1 ? "ão" : "ões"} aguardando aprovação.`}
        actions={
          <Link href="/agenda" className={styles.actionBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo agendamento
          </Link>
        }
      />

      <div className={styles.kpis}>
        <KPI label="Atendimentos hoje" value={kpis.atendimentosHoje} icon="calendar" />
        <KPI label="Próximas 24h" value={kpis.proximas24h} icon="clock" />
        <KPI label="Novos pacientes" value={kpis.novosPacientesMes} icon="users" />
        <KPI label="Aprovações" value={kpis.aprovacoesPendentes} icon="check" highlight={kpis.aprovacoesPendentes > 0} />
      </div>

      <div className={styles.grid}>
        <section className={styles.cardLarge}>
          <header className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Agenda de hoje</h2>
              <p className={styles.cardSubtitle}>
                {agendaHoje.length} atendimento{agendaHoje.length === 1 ? "" : "s"}
              </p>
            </div>
            <Link href="/agenda" className={styles.linkVer}>
              Ver agenda →
            </Link>
          </header>

          {agendaHoje.length === 0 ? (
            <div className={styles.empty}>Sem atendimentos hoje.</div>
          ) : (
            <div className={styles.agendaList}>
              {agendaHoje.map((a) => {
                const cor = STATUS_COR[a.status] ?? STATUS_COR.agendado;
                return (
                  <div key={a.id} className={styles.agendaItem}>
                    <span className={styles.agendaHora}>{formatHora(a.data_hora_inicio)}</span>
                    <div className={styles.agendaAvatar}>{inicial(a.paciente?.nome_completo ?? "")}</div>
                    <div className={styles.agendaBody}>
                      <span className={styles.agendaNome}>{a.paciente?.nome_completo ?? "—"}</span>
                      <span className={styles.agendaServico}>{a.servico?.nome ?? "—"}</span>
                    </div>
                    <span className={styles.agendaProf}>
                      {a.profissional?.nome_completo?.split(" ")[0] ?? "—"}
                    </span>
                    <span
                      className={styles.statusBadge}
                      style={{ background: cor.bg, color: cor.fg }}
                    >
                      • {cor.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className={styles.cardSmall}>
          <header className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Aprovações pendentes</h2>
              <p className={styles.cardSubtitle}>
                {kpis.aprovacoesPendentes} novas
              </p>
            </div>
            <Link href="/aprovacoes" className={styles.linkVer}>
              Ver todas →
            </Link>
          </header>

          {aprovacoes.length === 0 ? (
            <div className={styles.empty}>Sem solicitações pendentes.</div>
          ) : (
            <div className={styles.aprovacoesList}>
              {aprovacoes.map((a) => {
                const dados = (a.dados ?? {}) as Record<string, unknown>;
                const servicoNome = String(dados.servico_nome ?? "Serviço");
                const dataIso = String(dados.data_hora_preferida ?? "");
                const dataFmt = dataIso ? formatAprovDate(dataIso) : "";
                return (
                  <div key={a.id} className={styles.aprovItem}>
                    <div className={styles.aprovAvatar}>{inicial(a.solicitante?.nome_completo ?? "")}</div>
                    <div className={styles.aprovBody}>
                      <span className={styles.aprovNome}>{a.solicitante?.nome_completo ?? "—"}</span>
                      <span className={styles.aprovMeta}>
                        {servicoNome}{dataFmt ? ` · ${dataFmt}` : ""}
                      </span>
                    </div>
                    <div className={styles.aprovActions}>
                      <form action={recusarAction}>
                        <input type="hidden" name="id" value={a.id} />
                        <button type="submit" className={styles.btnRecusar} title="Recusar">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </form>
                      <form action={aprovarAction}>
                        <input type="hidden" name="id" value={a.id} />
                        <button type="submit" className={styles.btnAprovar} title="Aprovar">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function formatAprovDate(iso: string): string {
  const d = new Date(iso);
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d.getDate()} ${meses[d.getMonth()]}, ${pad(d.getHours())}h`;
}

function KPI({ label, value, icon, highlight }: { label: string; value: number; icon: string; highlight?: boolean }) {
  return (
    <div className={`${styles.kpiBox} ${highlight ? styles.kpiHighlight : ""}`}>
      <div className={styles.kpiHeader}>
        <span className={styles.kpiLabel}>{label}</span>
        <span className={styles.kpiIcon}>
          <KpiIcon name={icon} />
        </span>
      </div>
      <span className={styles.kpiValue}>{value}</span>
    </div>
  );
}

function KpiIcon({ name }: { name: string }) {
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "calendar") return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  if (name === "clock") return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
  if (name === "users") return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
  if (name === "check") return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
  return null;
}