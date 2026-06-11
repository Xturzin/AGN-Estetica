import React from "react";
import { Icon, Avatar, Pill } from "@/frontend/components/ui";
import type { Appointment, WeekPoint } from "@/frontend/lib/types";

export function Metric({ label, value, unit, delta, up = true, icon }: {
  label: string; value: string; unit?: string; delta?: string; up?: boolean; icon: string;
}) {
  return (
    <div className="card card-pad" style={{ flex: 1, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="eyebrow">{label}</span>
        <Icon name={icon} size={18} color="var(--ink-4)" />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 16 }}>
        <span className="num" style={{ fontSize: 38, fontWeight: 500 }}>{value}</span>
        {unit && <span style={{ fontSize: 16, color: "var(--ink-3)", fontWeight: 500 }}>{unit}</span>}
      </div>
      {delta && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12.5, fontWeight: 600, color: up ? "var(--accent)" : "#a86a5a" }}>
            <Icon name="trendUp" size={14} sw={2} style={{ transform: up ? "none" : "scaleY(-1)" }} />{delta}
          </span>
          <span style={{ fontSize: 12, color: "var(--ink-4)" }}>vs. mês anterior</span>
        </div>
      )}
    </div>
  );
}

export function ApptRow({ a, last }: { a: Appointment; last?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 0", borderBottom: last ? "none" : "1px solid var(--line)" }}>
      <div className="num" style={{ width: 52, fontSize: 15, color: "var(--ink-2)", fontWeight: 500 }}>{a.t}</div>
      <div style={{ width: 1, height: 30, background: "var(--line-2)" }} />
      <Avatar name={a.n} size={38} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{a.n}</div>
        <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{a.s}</div>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--ink-3)", width: 92 }}>{a.p}</div>
      <Pill kind={a.st}>{a.stl}</Pill>
    </div>
  );
}

export function MiniBars({ data, highlight }: { data: WeekPoint[]; highlight: number }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: "100%", height: 96, display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: "100%", height: (d.v / max * 100) + "%", borderRadius: 6,
              background: i === highlight ? "var(--accent)" : "var(--accent-tint-2)" }} />
          </div>
          <span style={{ fontSize: 11, color: i === highlight ? "var(--accent-deep)" : "var(--ink-4)", fontWeight: i === highlight ? 600 : 500 }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}

export function ApprovalRow({ n, s, when, last }: { n: string; s: string; when: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 0", borderBottom: last ? "none" : "1px solid var(--line)" }}>
      <Avatar name={n} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{n}</div>
        <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{s} · {when}</div>
      </div>
      <button style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid var(--line-2)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-3)" }}>
        <Icon name="x" size={16} />
      </button>
      <button style={{ width: 34, height: 34, borderRadius: 9, border: "none", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Icon name="check" size={16} sw={2.2} color="#fff" />
      </button>
    </div>
  );
}