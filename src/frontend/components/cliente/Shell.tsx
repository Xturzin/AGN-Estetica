"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/frontend/components/ui";

export function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? "#fff" : "var(--ink)";
  return (
    <div style={{ height: 44, flex: "0 0 44px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px 0 30px" }}>
      <span className="tnum" style={{ fontSize: 14.5, fontWeight: 600, color: c, letterSpacing: ".01em" }}>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke={c} strokeWidth="1.4"><path d="M1 3.5a10 10 0 0 1 14 0M3.5 6a6.4 6.4 0 0 1 9 0" /><path d="M8 9h.01" strokeWidth="2.2" strokeLinecap="round" /></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="1" y="1" width="20" height="10" rx="3" stroke={c} strokeOpacity="0.4" /><rect x="3" y="3" width="14" height="6" rx="1.5" fill={c} /><rect x="22.5" y="4" width="1.6" height="4" rx="0.8" fill={c} fillOpacity="0.4" /></svg>
      </div>
    </div>
  );
}

export const CLIENT_TABS = [
  { key: "home", label: "Início", icon: "home", href: "/cliente/home" },
  { key: "agendar", label: "Agendar", icon: "calendar", href: "/cliente/agendar" },
  { key: "historico", label: "Histórico", icon: "clock", href: "/cliente/historico" },
  { key: "perfil", label: "Perfil", icon: "user", href: "/cliente/perfil" },
];

export function TabBar() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    return pathname.startsWith(href);
  }

  return (
    <div style={{
      flex: "0 0 auto", borderTop: "1px solid var(--line)", background: "rgba(255,255,255,.9)", backdropFilter: "blur(12px)",
      padding: "9px 12px 26px", display: "flex", justifyContent: "space-around",
    }}>
      {CLIENT_TABS.map(t => {
        const on = isActive(t.href);
        return (
          <Link key={t.key} href={t.href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 64, textDecoration: "none" }}>
            <Icon name={t.icon} size={23} sw={on ? 1.9 : 1.6} color={on ? "var(--accent)" : "var(--ink-4)"} />
            <span style={{ fontSize: 10.5, fontWeight: on ? 600 : 500, color: on ? "var(--accent-deep)" : "var(--ink-4)" }}>{t.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function PhoneShell({ children, bg = "var(--surface-2)", statusDark = false, noTabs = false, pad = 0 }: {
  children: React.ReactNode; bg?: string; statusDark?: boolean; noTabs?: boolean; pad?: number;
}) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      background: "#1a1d22",
    }}>
      <div className="es" style={{
        width: "100%",
        maxWidth: 440,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: bg,
        position: "relative",
        boxShadow: "0 0 60px rgba(0,0,0,.25)",
      }}>
        <StatusBar dark={statusDark} />
        <div className="scrolly" style={{ flex: 1, padding: pad, position: "relative" }}>{children}</div>
        {!noTabs && <TabBar />}
      </div>
    </div>
  );
}