"use client";

import React, { useState } from "react";
import { Btn } from "@/frontend/components/ui";
import { PhoneShell } from "@/frontend/components/cliente/Shell";
import { CLIENT_SERVICES, WK, SLOTS } from "@/frontend/lib/mock-data";

export function Agendamento() {
  const [servico, setServico] = useState(0);
  const [dia, setDia] = useState(2);
  const [slot, setSlot] = useState(2);

  return (
    <PhoneShell>
      <div style={{ padding: "8px 20px 100px" }}>
        <h1 className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-.01em", marginBottom: 22 }}>Solicitar agendamento</h1>

        <div style={{ marginBottom: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>1 · Escolha o serviço</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CLIENT_SERVICES.map((s, i) => (
              <div key={i} onClick={() => setServico(i)} style={{
                padding: "12px 14px", borderRadius: 12, border: `1px solid ${servico === i ? "var(--accent)" : "var(--line)"}`,
                background: servico === i ? "var(--accent-tint)" : "var(--surface)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{s.d}</div>
                </div>
                <span><span style={{ fontSize: 11, color: "var(--ink-3)" }}>R$ </span><span className="num" style={{ fontSize: 16, fontWeight: 600 }}>{s.p}</span></span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>2 · Escolha o dia</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {WK.map(([d, n], i) => (
              <div key={i} onClick={() => setDia(i)} style={{
                flex: "0 0 56px", padding: "10px 0", borderRadius: 12, textAlign: "center",
                background: dia === i ? "var(--accent)" : "var(--surface)", color: dia === i ? "#fff" : "var(--ink)",
                border: dia === i ? "none" : "1px solid var(--line)", cursor: "pointer",
              }}>
                <div style={{ fontSize: 11, opacity: 0.85 }}>{d}</div>
                <div className="num" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{n}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>3 · Escolha o horário</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {SLOTS.map((s, i) => (
              <div key={i} onClick={() => setSlot(i)} style={{
                padding: "12px 0", borderRadius: 11, textAlign: "center", fontSize: 14, fontWeight: 600,
                background: slot === i ? "var(--accent)" : "var(--surface)", color: slot === i ? "#fff" : "var(--ink)",
                border: slot === i ? "none" : "1px solid var(--line)", cursor: "pointer",
              }}>{s}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 76, left: 0, right: 0, padding: "12px 20px 14px", background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
        <Btn variant="primary" block size="lg" icon="check">Solicitar agendamento</Btn>
      </div>
    </PhoneShell>
  );
}

export default Agendamento;