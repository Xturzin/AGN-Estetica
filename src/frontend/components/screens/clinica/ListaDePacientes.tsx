"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Icon, Btn, Avatar, Pill } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";

interface PacienteUI {
  id: string;
  n: string;
  e: string;
  ph: string;
  last: string;
  next: string;
  st: "ok" | "warn" | "muted" | "info";
  stl: string;
  ct: number;
}

interface ListaDePacientesProps {
  user: { name: string; role: string };
  aprovacoesPendentes: number;
  clinicaNome: string;
  pacientes: PacienteUI[];
}

export function ListaDePacientes({ user, aprovacoesPendentes, clinicaNome, pacientes }: ListaDePacientesProps) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "ok" | "warn" | "muted">("todos");

  const counts = useMemo(() => {
    const c = { todos: pacientes.length, ok: 0, warn: 0, muted: 0 };
    for (const p of pacientes) {
      if (p.st === "ok") c.ok++;
      else if (p.st === "warn") c.warn++;
      else if (p.st === "muted") c.muted++;
    }
    return c;
  }, [pacientes]);

  const filtrados = useMemo(() => {
    let r = pacientes;
    if (filtro !== "todos") r = r.filter(p => p.st === filtro);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      r = r.filter(p => p.n.toLowerCase().includes(q) || p.e.toLowerCase().includes(q));
    }
    return r;
  }, [pacientes, filtro, busca]);

  return (
    <ClinicShell
      user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      title="Pacientes" sub={`${pacientes.length} cadastrados`}
      topRight={<>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 38, padding: "0 12px", borderRadius: 11, border: "1px solid var(--line-2)", background: "var(--surface)", width: 280 }}>
          <Icon name="search" size={16} color="var(--ink-3)" />
          <input
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{ border: 0, outline: 0, background: "transparent", flex: 1, fontSize: 13.5, fontFamily: "var(--sans)" }}
          />
        </div>
        <Btn size="sm" icon="plus">Novo paciente</Btn>
      </>}
    >
      <div className="card">
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span onClick={() => setFiltro("todos")} className={"chip" + (filtro === "todos" ? " chip-active" : "")}>Todos · {counts.todos}</span>
            <span onClick={() => setFiltro("ok")} className={"chip" + (filtro === "ok" ? " chip-active" : "")}>Ativos · {counts.ok}</span>
            <span onClick={() => setFiltro("warn")} className={"chip" + (filtro === "warn" ? " chip-active" : "")}>Em tratamento · {counts.warn}</span>
            <span onClick={() => setFiltro("muted")} className={"chip" + (filtro === "muted" ? " chip-active" : "")}>Inativos · {counts.muted}</span>
          </div>
          <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>Ordenar: Última visita</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface-2)" }}>
              <th style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>Paciente</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>Telefone</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>Última visita</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>Próximo</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)" }}>Status</th>
              <th style={{ width: 48 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p, i) => (
              <tr key={p.id} style={{ borderTop: i === 0 ? "none" : "1px solid var(--line)" }}>
                <td style={{ padding: "14px 24px" }}>
                  <Link href={`/pacientes/${p.id}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
                    <Avatar name={p.n} size={36} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{p.n}</div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{p.e}</div>
                    </div>
                  </Link>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--ink-2)", fontVariantNumeric: "tabular-nums" }}>{p.ph}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--ink-2)" }}>{p.last}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--ink-2)" }}>{p.next}</td>
                <td style={{ padding: "14px 16px" }}><Pill kind={p.st}>{p.stl}</Pill></td>
                <td style={{ padding: "14px 16px" }}>
                  <Link href={`/pacientes/${p.id}`} style={{ color: "var(--ink-3)" }}><Icon name="chevronRight" size={18} /></Link>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 48, textAlign: "center", color: "var(--ink-3)" }}>Nenhum paciente encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </ClinicShell>
  );
}

export default ListaDePacientes;