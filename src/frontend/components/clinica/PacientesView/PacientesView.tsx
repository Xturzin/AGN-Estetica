"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { Paciente } from "@/backend/services/pacienteService";
import styles from "./PacientesView.module.css";

interface PacientesViewProps {
  pacientes: Paciente[];
}

type Filtro = "todos" | "ativo" | "em_tratamento" | "inativo";

const STATUS_COR: Record<string, { bg: string; fg: string; label: string }> = {
  ativo: { bg: "var(--success-tint)", fg: "var(--success)", label: "Ativo" },
  em_tratamento: { bg: "var(--warn-tint)", fg: "var(--warn)", label: "Em tratamento" },
  inativo: { bg: "var(--surface-3)", fg: "var(--ink-3)", label: "Inativo" },
  novo: { bg: "var(--brand-tint)", fg: "var(--brand-deep)", label: "Novo" },
};

const PAGE_SIZE = 9;

function inicial(nome: string): string {
  const p = nome.trim().split(" ").filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0][0]?.toUpperCase() ?? "?";
  return ((p[0][0] ?? "") + (p[p.length - 1][0] ?? "")).toUpperCase();
}

function dataCurta(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

export function PacientesView({ pacientes }: PacientesViewProps) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);

  const counts = useMemo(() => {
    const c = { total: pacientes.length, ativo: 0, em_tratamento: 0, inativo: 0 };
    for (const p of pacientes) {
      if (p.status === "ativo") c.ativo++;
      else if (p.status === "em_tratamento") c.em_tratamento++;
      else if (p.status === "inativo") c.inativo++;
    }
    return c;
  }, [pacientes]);

  const filtrados = useMemo(() => {
    let r = pacientes;
    if (filtro !== "todos") r = r.filter((p) => p.status === filtro);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      r = r.filter(
        (p) =>
          p.nome_completo.toLowerCase().includes(q) ||
          (p.email ?? "").toLowerCase().includes(q) ||
          (p.telefone ?? "").includes(q)
      );
    }
    return r;
  }, [pacientes, filtro, busca]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * PAGE_SIZE;
  const paginados = filtrados.slice(inicio, inicio + PAGE_SIZE);

  function setFiltroReset(f: Filtro) {
    setFiltro(f);
    setPagina(1);
  }

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.titulo}>Pacientes</h1>
          <p className={styles.subtitulo}>{counts.total} paciente{counts.total === 1 ? "" : "s"} cadastrado{counts.total === 1 ? "" : "s"}</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              placeholder="Buscar por nome ou e-mail..."
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
              className={styles.searchInput}
            />
          </div>
          <Link href="/pacientes/novo" className={styles.btnPrimary}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo paciente
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.chips}>
            <button type="button" onClick={() => setFiltroReset("todos")} className={`${styles.chip} ${filtro === "todos" ? styles.chipActive : ""}`}>Todos · {counts.total}</button>
            <button type="button" onClick={() => setFiltroReset("ativo")} className={`${styles.chip} ${filtro === "ativo" ? styles.chipActive : ""}`}>Ativos · {counts.ativo}</button>
            <button type="button" onClick={() => setFiltroReset("em_tratamento")} className={`${styles.chip} ${filtro === "em_tratamento" ? styles.chipActive : ""}`}>Em tratamento · {counts.em_tratamento}</button>
            <button type="button" onClick={() => setFiltroReset("inativo")} className={`${styles.chip} ${filtro === "inativo" ? styles.chipActive : ""}`}>Inativos · {counts.inativo}</button>
          </div>
          <span className={styles.sortLabel}>Ordenar: Última visita</span>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>PACIENTE</th>
              <th>TELEFONE</th>
              <th>ÚLTIMA VISITA</th>
              <th>PRÓXIMO</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginados.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>Nenhum paciente encontrado.</td>
              </tr>
            ) : (
              paginados.map((p) => {
                const statusKey = p.status ?? "ativo";
                const cor = STATUS_COR[statusKey] ?? STATUS_COR.ativo;
                return (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/pacientes/${p.id}`} className={styles.pacienteCell}>
                        <span className={styles.avatar}>{inicial(p.nome_completo)}</span>
                        <span className={styles.pacienteInfo}>
                          <span className={styles.pacienteNome}>{p.nome_completo}</span>
                          <span className={styles.pacienteEmail}>{p.email ?? "—"}</span>
                        </span>
                      </Link>
                    </td>
                    <td className={styles.cellMono}>{p.telefone ?? "—"}</td>
                    <td>{dataCurta(p.updated_at)}</td>
                    <td>—</td>
                    <td>
                      <span className={styles.statusPill} style={{ background: cor.bg, color: cor.fg }}>
                        • {cor.label}
                      </span>
                    </td>
                    <td className={styles.cellChevron}>
                      <Link href={`/pacientes/${p.id}`} aria-label="Abrir">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className={styles.footer}>
          <span className={styles.footerInfo}>
            Mostrando {filtrados.length === 0 ? 0 : inicio + 1}–{Math.min(inicio + PAGE_SIZE, filtrados.length)} de {filtrados.length}
          </span>
          <div className={styles.pagination}>
            <button type="button" onClick={() => setPagina(Math.max(1, paginaAtual - 1))} disabled={paginaAtual === 1} className={styles.pageBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).slice(0, 3).map((n) => (
              <button key={n} type="button" onClick={() => setPagina(n)} className={`${styles.pageBtn} ${n === paginaAtual ? styles.pageBtnActive : ""}`}>
                {n}
              </button>
            ))}
            {totalPaginas > 3 && <span className={styles.pageMore}>...</span>}
            <button type="button" onClick={() => setPagina(Math.min(totalPaginas, paginaAtual + 1))} disabled={paginaAtual === totalPaginas} className={styles.pageBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}