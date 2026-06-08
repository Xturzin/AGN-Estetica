import { Card } from "@/frontend/components/ui";
import type { DashboardKPIs as KPIs } from "@/backend/services/dashboardService";
import styles from "./DashboardKPIs.module.css";

interface DashboardKPIsProps {
  kpis: KPIs;
}

export function DashboardKPIs({ kpis }: DashboardKPIsProps) {
  return (
    <div className={styles.grid}>
      <KPICard
        label="Pacientes ativos"
        value={kpis.totalPacientesAtivos}
        hint="No total"
      />
      <KPICard
        label="Novos cadastros"
        value={kpis.cadastrosNoMes}
        hint="Este mês"
      />
      <KPICard
        label="Próximos agendamentos"
        value={kpis.proximosAgendamentos}
        hint="Em breve"
        soon
      />
      <KPICard
        label="Aprovações pendentes"
        value={kpis.aprovacoesPendentes}
        hint="Em breve"
        soon
      />
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: number | null;
  hint: string;
  soon?: boolean;
}

function KPICard({ label, value, hint, soon }: KPICardProps) {
  return (
    <Card>
      <div className={styles.card}>
        <span className={styles.label}>{label}</span>
        <span className={`${styles.value} ${soon ? styles.valueSoon : ""}`}>
          {value === null ? "—" : value}
        </span>
        <span className={`${styles.hint} ${soon ? styles.hintSoon : ""}`}>
          {hint}
        </span>
      </div>
    </Card>
  );
}