import Link from "next/link";

interface DashboardCard {
  href: string;
  title: string;
  desc: string;
}

const CARDS: DashboardCard[] = [
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
];

export default function DashboardPage() {
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
        {CARDS.map((c) => (
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