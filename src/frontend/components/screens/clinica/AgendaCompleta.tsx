"use client";

import React from "react";
import { Icon, Btn } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";
import { AG_DAYS, AG_TONE, AG_APPTS, H0, H1, ROW } from "@/frontend/lib/mock-data";

export function AgendaCompleta({ user, aprovacoesPendentes, clinicaNome }: {
  user: { name: string; role: string }; aprovacoesPendentes: number; clinicaNome: string;
}) {
  const hours = Array.from({ length: H1 - H0 + 1 }, (_, i) => H0 + i);

  return (
    <ClinicShell
      user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      kicker="Semana de 26 a 31 de maio"
      title="Agenda"
      topRight={<>
        <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid var(--line-2)", borderRadius: 11, background: "var(--surface)", padding: 4 }}>
          <button style={{ width: 32, height: 32, border: 0, background: "transparent", cursor: "pointer", borderRadius: 8 }}><Icon name="chevronLeft" size={16} /></button>
          <span style={{ fontSize: 13, fontWeight: 600, padding: "0 6px" }}>Mai 2026</span>
          <button style={{ width: 32, height: 32, border: 0, background: "transparent", cursor: "pointer", borderRadius: 8 }}><Icon name="chevronRight" size={16} /></button>
        </div>
        <Btn variant="ghost" size="sm" icon="filter">Filtrar</Btn>
        <Btn size="sm" icon="plus">Novo</Btn>
      </>}
    >
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "70px repeat(6, 1fr)", borderBottom: "1px solid var(--line)" }}>
          <div />
          {AG_DAYS.map(([d, n], i) => (
            <div key={i} style={{ padding: "16px 14px", borderLeft: "1px solid var(--line)" }}>
              <div className="eyebrow" style={{ fontSize: 10.5 }}>{d}</div>
              <div className="num" style={{ fontSize: 22, fontWeight: 500, marginTop: 2 }}>{n}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "70px repeat(6, 1fr)", position: "relative" }}>
          <div style={{ borderRight: "1px solid var(--line)" }}>
            {hours.map(h => (
              <div key={h} style={{ height: ROW, padding: "8px 12px", fontSize: 11, color: "var(--ink-4)", borderBottom: "1px solid var(--line)" }}>
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {AG_DAYS.map((_, d) => (
            <div key={d} style={{ borderLeft: "1px solid var(--line)", position: "relative" }}>
              {hours.map(h => (
                <div key={h} style={{ height: ROW, borderBottom: "1px solid var(--line)" }} />
              ))}

              {AG_APPTS.filter(a => a.d === d).map((a, i) => {
                const top = (a.s - H0) * ROW;
                const height = (a.e - a.s) * ROW - 4;
                const tone = AG_TONE[a.t];
                return (
                  <div key={i} style={{
                    position: "absolute", top, left: 4, right: 4, height,
                    background: tone.bg, borderLeft: `3px solid ${tone.bar}`, borderRadius: 8,
                    padding: "8px 10px", overflow: "hidden",
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: tone.tx, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.n}</div>
                    <div style={{ fontSize: 11, color: tone.tx, opacity: 0.85, marginTop: 1 }}>{a.sv}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </ClinicShell>
  );
}

export default AgendaCompleta;