"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Logo, Avatar, IconBtn } from "@/frontend/components/ui";

export interface ClinicNavItem {
  section?: string;
  key?: string;
  label?: string;
  icon?: string;
  href?: string;
  badge?: number;
}

export const CLINIC_NAV: ClinicNavItem[] = [
  { section: "Principal" },
  { key: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { key: "agenda", label: "Agenda", icon: "calendar", href: "/agenda" },
  { key: "aprovacoes", label: "Aprovações", icon: "calendarCheck", href: "/aprovacoes" },
  { key: "pacientes", label: "Pacientes", icon: "users", href: "/pacientes" },
  { section: "Clínica" },
  { key: "servicos", label: "Serviços", icon: "sliders", href: "/servicos" },
  { key: "usuarios", label: "Usuários", icon: "user", href: "/usuarios" },
  { key: "config", label: "Configurações", icon: "settings", href: "/configuracoes" },
];

export function Sidebar({ aprovacoesPendentes = 0, clinicaNome = "Clínica" }: { aprovacoesPendentes?: number; clinicaNome?: string }) {
  const pathname = usePathname();
  const inicial = (clinicaNome[0] ?? "C").toUpperCase();

  function isActive(href?: string): boolean {
    if (!href) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside style={{
      width: 250, flex: "0 0 250px", height: "100%", background: "var(--surface)",
      borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", padding: "24px 16px 18px",
    }}>
      <div style={{ padding: "4px 10px 6px" }}><Logo size={18} /></div>

      <nav style={{ marginTop: 18, flex: 1 }}>
        {CLINIC_NAV.map((it, i) => it.section ? (
          <div key={i} className="nav-section">{it.section}</div>
        ) : (
          <Link
            key={it.key}
            href={it.href ?? "#"}
            className={"nav-item" + (isActive(it.href) ? " active" : "")}
          >
            <Icon name={it.icon!} size={19} sw={1.7} />
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.key === "aprovacoes" && aprovacoesPendentes > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#fff", background: "var(--accent)",
                minWidth: 19, height: 19, borderRadius: 10, display: "flex", alignItems: "center",
                justifyContent: "center", padding: "0 5px",
              }}>{aprovacoesPendentes}</span>
            )}
          </Link>
        ))}
      </nav>

      <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-md)", padding: 13, background: "var(--surface-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="serif" style={{ color: "#fff", fontSize: 16 }}>{inicial}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{clinicaNome}</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Plano Premium</div>
          </div>
          <Icon name="chevronDown" size={15} color="var(--ink-4)" />
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ title, sub, kicker, right, user }: {
  title?: string; sub?: string; kicker?: string; right?: React.ReactNode;
  user?: { name: string; role: string };
}) {
  const u = user ?? { name: "Usuário", role: "" };
  return (
    <header style={{
      height: 76, flex: "0 0 76px", borderBottom: "1px solid var(--line)", background: "rgba(255,255,255,.72)",
      backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 34px", gap: 24, position: "sticky", top: 0, zIndex: 10,
    }}>
      <div style={{ minWidth: 0 }}>
        {kicker && <div className="eyebrow" style={{ marginBottom: 3 }}>{kicker}</div>}
        {title && <h1 className="serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-.015em", lineHeight: 1.1 }}>{title}</h1>}
        {sub && <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 1 }}>{sub}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {right || (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 14px", borderRadius: 11,
            border: "1px solid var(--line-2)", background: "var(--surface)", color: "var(--ink-4)", width: 230,
          }}>
            <Icon name="search" size={17} />
            <span style={{ fontSize: 13.5 }}>Buscar paciente, serviço…</span>
          </div>
        )}
        <IconBtn name="bell" badge />
        <div style={{ width: 1, height: 30, background: "var(--line-2)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Avatar name={u.name.replace("Dra. ", "")} size={38} />
          <div style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{u.name}</div>
            {u.role && <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{u.role}</div>}
          </div>
          <Icon name="chevronDown" size={15} color="var(--ink-4)" />
        </div>
      </div>
    </header>
  );
}

export function ClinicShell({ title, sub, kicker, topRight, children, user, aprovacoesPendentes, clinicaNome, pad = 34, bg = "var(--bg)" }: {
  title?: string; sub?: string; kicker?: string; topRight?: React.ReactNode;
  children: React.ReactNode; user?: { name: string; role: string };
  aprovacoesPendentes?: number; clinicaNome?: string;
  pad?: number; bg?: string;
}) {
  return (
    <div className="es" style={{ display: "flex", height: "100vh", background: bg }}>
      <Sidebar aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Topbar title={title} sub={sub} kicker={kicker} right={topRight} user={user} />
        <div className="scrolly" style={{ flex: 1, padding: pad }}>
          {children}
        </div>
      </div>
    </div>
  );
}