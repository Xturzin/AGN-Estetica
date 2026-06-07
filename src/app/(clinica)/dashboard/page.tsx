import Link from "next/link";
import { getCurrentUser } from "@/backend/lib/auth/session";

interface DashboardCard {
  href: string;
  title: string;
  desc: string;
  adminOnly?: boolean;
}

const CARDS: DashboardCard[] = [
  {
    href: "/pacientes",
    title: "Pacientes",
    desc: "Cadastro e prontuário dos pacientes.",
  },
  {
    href: "/configuracoes",
    title: "Configurações",
    desc: "Dados, contato, endereço, horário e logo.",
  },
  {
    href: "/servicos",
    title: "Serviços",
    desc: "Procedimentos oferecidos pela clínica.",
  },
  {
    href: "/usuarios",
    title: "Equipe",
    desc: "Membros da clínica e seus acessos.",
  },
  {
    href: "/permissoes",
    title: "Permissões",
    desc: "Matriz de acessos da equipe.",
    adminOnly: true,
  },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const isAdmin = user?.tipo === "admin";
  const visibleCards = CARDS.filter((c) => !c.adminOnly || isAdmin);

  return (
    <div
      style={{
        padding: "32px clamp(20px, 4vw, 48px)",
        maxWidth: 880,
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-head)",
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Bem-vindo à AGN Estética
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginTop: 6 }}>
          Placeholder do dashboard. Em breve: agenda, pacientes, atendimentos.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {visibleCards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="agn-card agn-card--pad"
            style={{
              textDecoration: "none",
              color: "var(--ink)",
              display: "block",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-head)",
                fontSize: 18,
                fontWeight: 700,
                margin: 0,
              }}
            >
              {c.title}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--ink-3)",
                marginTop: 6,
                marginBottom: 0,
              }}
            >
              {c.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}