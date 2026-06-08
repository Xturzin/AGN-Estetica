import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/frontend/components/ui";
import { getCurrentUser } from "@/backend/lib/auth/session";
import { getDashboardKPIs } from "@/backend/services/dashboardService";
import { DashboardKPIs } from "@/frontend/components/clinica/DashboardKPIs";
import styles from "./dashboard.module.css";

interface ShortcutCard {
  label: string;
  description: string;
  href: string;
  adminOnly?: boolean;
  soon?: boolean;
}

const SHORTCUTS: ShortcutCard[] = [
  { label: "Pacientes", description: "Cadastros, perfis e prontuários", href: "/pacientes" },
  { label: "Agenda", description: "Visão semanal e novos agendamentos", href: "/agenda" },
  { label: "Aprovações", description: "Solicitações do app do cliente", href: "/aprovacoes" },
  { label: "Serviços", description: "Catálogo de procedimentos", href: "/servicos" },
  { label: "Equipe", description: "Profissionais e recepcionistas", href: "/usuarios", adminOnly: true },
  { label: "Configurações", description: "Dados da clínica e horários", href: "/configuracoes", adminOnly: true },
  { label: "Permissões", description: "Matriz de permissões da equipe", href: "/permissoes", adminOnly: true },
];

function getSaudacao(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.tipo === "cliente") redirect("/cliente/home");

  const kpis = await getDashboardKPIs();

  const visibleCards = SHORTCUTS.filter(
    (c) => !c.adminOnly || user.tipo === "admin"
  );

  const primeiroNome = user.nome_completo?.split(" ")[0] ?? "";

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {getSaudacao()}
          {primeiroNome ? `, ${primeiroNome}` : ""}.
        </h1>
        <p className={styles.subtitle}>
          Aqui está um resumo da clínica.
        </p>
      </header>

      <DashboardKPIs kpis={kpis} />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Atalhos</h2>
        <div className={styles.shortcuts}>
          {visibleCards.map((c) =>
            c.soon ? (
              <div key={c.href} className={styles.shortcutItem}>
                <Card>
                  <div className={`${styles.shortcut} ${styles.shortcutSoon}`}>
                    <span className={styles.shortcutLabel}>{c.label}</span>
                    <span className={styles.shortcutDesc}>{c.description}</span>
                    <span className={styles.shortcutSoonBadge}>Em breve</span>
                  </div>
                </Card>
              </div>
            ) : (
              <Link key={c.href} href={c.href} className={styles.shortcutLink}>
                <Card>
                  <div className={styles.shortcut}>
                    <span className={styles.shortcutLabel}>{c.label}</span>
                    <span className={styles.shortcutDesc}>{c.description}</span>
                  </div>
                </Card>
              </Link>
            )
          )}
        </div>
      </section>
    </div>
  );
}