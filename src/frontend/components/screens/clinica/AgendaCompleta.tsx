"use client";

import React from "react";
import { Btn, IconBtn } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";

const DAYS = [
  { dow: "SEG", day: 26, isToday: false },
  { dow: "TER", day: 27, isToday: false },
  { dow: "QUA", day: 28, isToday: false },
  { dow: "QUI", day: 29, isToday: false },
  { dow: "SEX", day: 30, isToday: true },
  { dow: "SÁB", day: 31, isToday: false },
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const ROW = 64;
const H0 = 8;

type Tone = "cobalt" | "slate" | "sand";

const TONE: Record<Tone, { bg: string; border: string; text: string; dot: string }> = {
  cobalt: { bg: "#e8f0ff", border: "#1f6dff", text: "#1f6dff", dot: "#1f6dff" },
  slate: { bg: "#eef0f3", border: "#7a8290", text: "#5a6271", dot: "#7a8290" },
  sand: { bg: "#fbf2d9", border: "#c9a247", text: "#8a6d2c", dot: "#c9a247" },
};

interface Appt {
  day: number; start: number; end: number; time: string; name: string; service: string; tone: Tone;
}

const APPTS: Appt[] = [
  { day: 0, start: 9, end: 10, time: "9:00", name: "Marina A.", service: "Limpeza de pele", tone: "cobalt" },
  { day: 0, start: 11, end: 12.5, time: "11:00", name: "Júlia C.", service: "Microagulhamento", tone: "slate" },
  { day: 0, start: 14.5, end: 15.5, time: "14:30", name: "Renata D.", service: "Drenagem", tone: "sand" },
  { day: 1, start: 10, end: 11.5, time: "10:00", name: "Beatriz M.", service: "Peeling", tone: "slate" },
  { day: 1, start: 13, end: 14, time: "13:00", name: "Sofia C.", service: "Botox", tone: "slate" },
  { day: 2, start: 9.5, end: 11, time: "9:30", name: "Letícia P.", service: "Limpeza", tone: "cobalt" },
  { day: 2, start: 11.5, end: 13, time: "11:30", name: "Helena R.", service: "Preenchimento", tone: "slate" },
  { day: 2, start: 15, end: 16.5, time: "15:00", name: "Clara V.", service: "Laser", tone: "sand" },
  { day: 3, start: 8.5, end: 9.5, time: "8:30", name: "Ana B.", service: "Avaliação", tone: "cobalt" },
  { day: 3, start: 13.5, end: 15, time: "13:30", name: "Paula T.", service: "Microagulhamento", tone: "slate" },
  { day: 4, start: 9, end: 10, time: "9:00", name: "Marina A.", service: "Retorno", tone: "cobalt" },
  { day: 4, start: 11.5, end: 13, time: "11:30", name: "Sofia C.", service: "Botox", tone: "slate" },
  { day: 4, start: 14, end: 15.5, time: "14:00", name: "Letícia P.", service: "Peeling", tone: "cobalt" },
  { day: 4, start: 17, end: 18.5, time: "17:00", name: "Ana B. Lopes", service: "Preenchimento", tone: "slate" },
  { day: 5, start: 9.5, end: 11.5, time: "9:30", name: "Workshop", service: "Equipe interna", tone: "sand" },
];

const HOUR_COL_W = 64;

export function AgendaCompleta({ user, aprovacoesPendentes, clinicaNome }: {
  user: { name: string; role: string }; aprovacoesPendentes: number; clinicaNome: string;
}) {
  return (
    <ClinicShell
      user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      kicker="26 - 31 DE MAIO · SEMANA 22"
      title="Agenda"
      sub="15 atendimentos agendados nesta semana"
      topRight={<>
        <Btn variant="ghost" size="sm" iconR="chevronDown">Profissional</Btn>
        <Btn size="sm" icon="plus">Novo agendamento</Btn>
      </>}
    >
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>

        {/* Header interno */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconBtn name="chevronLeft" size={32} />
            <IconBtn name="chevronRight" size={32} />
            <div className="serif" style={{ fontSize: 17, fontWeight: 600, marginLeft: 4 }}>Maio 2026</div>
            <span style={{ marginLeft: 8 }}><Btn variant="ghost" size="sm">Hoje</Btn></span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12.5 }}>
              {[
                ["Dra. Helena", TONE.cobalt.dot],
                ["Camila R.", TONE.slate.dot],
                ["Júlia M.", TONE.sand.dot],
              ].map(([nm, c], i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--ink-2)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                  {nm}
                </span>
              ))}
            </div>

            <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 9, padding: 2 }}>
              {["Dia", "Semana", "Mês"].map((t) => {
                const active = t === "Semana";
                return (
                  <button key={t} style={{
                    padding: "6px 14px", borderRadius: 7, border: 0, cursor: "pointer",
                    background: active ? "var(--ink)" : "transparent",
                    color: active ? "#fff" : "var(--ink-3)",
                    fontSize: 13, fontWeight: active ? 600 : 500,
                    fontFamily: "inherit",
                  }}>{t}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Header dos dias */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `${HOUR_COL_W}px repeat(6, 1fr)`,
          borderTop: "1px solid var(--line)",
        }}>
          <div />
          {DAYS.map((d, i) => (
            <div key={i} style={{
              padding: "14px 16px",
              borderLeft: "1px solid var(--line)",
              textAlign: "left",
            }}>
              <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 4 }}>{d.dow}</div>
              <div className="serif" style={{
                fontSize: 24,
                fontWeight: 500,
                color: d.isToday ? "var(--accent)" : "var(--ink)",
              }}>{d.day}</div>
            </div>
          ))}
        </div>

        {/* Body com cards */}
        <div style={{ position: "relative", borderTop: "1px solid var(--line)" }}>
          {/* Grid de fundo */}
          <div style={{ display: "grid", gridTemplateColumns: `${HOUR_COL_W}px repeat(6, 1fr)` }}>
            {HOURS.map((h, i) => (
              <React.Fragment key={i}>
                <div style={{
                  height: ROW,
                  padding: "6px 10px 0",
                  textAlign: "right",
                  fontSize: 11.5,
                  color: "var(--ink-3)",
                  borderTop: i > 0 ? "1px solid var(--line)" : "none",
                }}>
                  {h.toString().padStart(2, "0")}:00
                </div>
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} style={{
                    height: ROW,
                    borderTop: i > 0 ? "1px solid var(--line)" : "none",
                    borderLeft: "1px solid var(--line)",
                  }} />
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Cards absolute */}
          {APPTS.map((a, i) => {
            const startMin = (a.start - H0) * 60;
            const durMin = (a.end - a.start) * 60;
            const top = startMin * ROW / 60 + 4;
            const height = durMin * ROW / 60 - 8;
            const t = TONE[a.tone];

            return (
              <div key={i} style={{
                position: "absolute",
                left: `calc(${HOUR_COL_W}px + ${a.day} * ((100% - ${HOUR_COL_W}px) / 6) + 6px)`,
                width: `calc((100% - ${HOUR_COL_W}px) / 6 - 12px)`,
                top, height,
                background: t.bg,
                borderLeft: `3px solid ${t.border}`,
                borderRadius: 9,
                padding: "8px 11px",
                overflow: "hidden",
                cursor: "pointer",
              }}>
                <div style={{ fontSize: 11, color: t.text, fontWeight: 600 }}>{a.time}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.service}</div>
              </div>
            );
          })}
        </div>
      </div>
    </ClinicShell>
  );
}

export default AgendaCompleta;