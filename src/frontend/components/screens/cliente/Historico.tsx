"use client";

import React from "react";
import { Icon, PhotoSlot } from "@/frontend/components/ui";
import { PhoneShell } from "@/frontend/components/cliente/Shell";
import { CLIENT_HIST } from "@/frontend/lib/mock-data";

export function Historico() {
  return (
    <PhoneShell>
      <div style={{ padding: "8px 20px 16px" }}>
        <h1 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-.01em" }}>Meu histórico</h1>
        <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{CLIENT_HIST.length} procedimentos realizados</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, marginTop: 18, background: "var(--line)", borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)" }}>
          {[["Desde", "Mar 2026"], ["Sessões", String(CLIENT_HIST.length)], ["Próxima", "02 jun"]].map(([l, v], i) => (
            <div key={i} style={{ padding: "14px 8px", background: "var(--surface)", textAlign: "center" }}>
              <div className="num" style={{ fontSize: 16, fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16, marginBottom: 16 }}>
          {["Todos", "Facial", "Corporal"].map((c, i) => (
            <span key={i} className={"chip" + (i === 0 ? " chip-active" : "")}>{c}</span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div style={{ position: "absolute", left: 26, top: 28, bottom: 20, width: 2, background: "var(--line)" }} />
          {CLIENT_HIST.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 16, position: "relative" }}>
              <div style={{ background: "var(--accent-tint)", width: 54, padding: "8px 4px", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, zIndex: 1 }}>
                <span className="num" style={{ fontSize: 17, fontWeight: 700, color: "var(--accent-deep)", lineHeight: 1 }}>{h.d}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-deep)", letterSpacing: ".05em", textTransform: "uppercase" }}>{h.m}</span>
              </div>
              <div style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 600 }}>{h.s}</h3>
                    <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{h.prof}</p>
                  </div>
                  <Icon name="checkCircle" size={18} color="var(--accent)" />
                </div>
                {h.ph > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    {Array.from({ length: h.ph }).map((_, k) => <PhotoSlot key={k} w={60} h={60} radius={10} />)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

export default Historico;