"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./TabBar.module.css";

interface TabDef {
  href: string;
  label: string;
  iconActive: React.ReactNode;
  iconInactive: React.ReactNode;
}

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12 L12 3 L21 12 M5 10 V20 H19 V10" />
  </svg>
);

const CalendarIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9 H21 M8 3 V7 M16 3 V7 M12 13 V17 M10 15 H14" stroke={active ? "#FBF7F3" : "currentColor"} />
  </svg>
);

const ListIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const UserIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
  </svg>
);

const TABS: TabDef[] = [
  { href: "/cliente/home", label: "Início", iconActive: <HomeIcon active />, iconInactive: <HomeIcon active={false} /> },
  { href: "/cliente/agendar", label: "Agendar", iconActive: <CalendarIcon active />, iconInactive: <CalendarIcon active={false} /> },
  { href: "/cliente/historico", label: "Histórico", iconActive: <ListIcon active />, iconInactive: <ListIcon active={false} /> },
  { href: "/cliente/perfil", label: "Perfil", iconActive: <UserIcon active />, iconInactive: <UserIcon active={false} /> },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className={styles.tabbar}>
      {TABS.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`${styles.tab} ${active ? styles.tabActive : ""}`}
          >
            <span className={styles.icon}>{active ? t.iconActive : t.iconInactive}</span>
            <span className={styles.label}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}