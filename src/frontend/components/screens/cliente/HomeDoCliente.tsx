"use client";

import React from "react";
import { Icon, IconBtn, PhotoSlot } from "@/frontend/components/ui";
import { PhoneShell } from "@/frontend/components/cliente/Shell";
import { CLIENT_SERVICES } from "@/frontend/lib/mock-data";

const PAD = { padding: "0 20px" } as const;

export function HomeDoCliente({ primeiroNome = "Maria" }: { primeiroNome?: string }) {
  return (
    <PhoneShell>
      <div style={{ paddingBottom: 16 }}>
        <div style={{ ...PAD, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 16px" }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Olá,</div>
            <h1 className="serif" style={{ fontSize: 23, fontWeight: 500, letterSpacing: "-.01em" }}>{primeiroNome}</h1>
          </div>
          <IconBtn name="bell" badge />
        </div>

        <div style={{ ...PAD, marginBottom: 24 }}>
          <div style={{ background: "var(--accent-deep)", borderRadius: 22, padding: 22, color: "#fff", position: "relative", overflow: "hidden" }}>
            <div className="soft-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.14 }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.7)" }}>Próximo agendamento</span>
                <span style={{ fontSize: 11.5, fontWeight: 600, background: "rgba(255,255,255,.16)", padding: "4px 10px", borderRadius: 999 }}>Confirmado</span>
              </div>
              <h3 className="serif" style={{ fontSize: 21, fontWeight: 500, marginTop: 16 }}>Microagulhamento</h3>
              <div style={{ display: "flex", gap: 18, marginTop: 14, fontSize: 13.5, color: "rgba(255,255,255,.85)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="calendar" size={15} color="rgba(255,255,255,.7)" />30 mai, sex</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="clock" size={15} color="rgba(255,255,255,.7)" />17:00</span>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <button style={{ flex: 1, height: 40, borderRadius: 11, border: "none", background: "#fff", color: "var(--accent-deep)", fontWeight: 600, fontSize: 13.5, fontFamily: "var(--sans)", cursor: "pointer" }}>Ver detalhes</button>
                <button style={{ flex: 1, height: 40, borderRadius: 11, border: "1px solid rgba(255,255,255,.3)", background: "transparent", color: "#fff", fontWeight: 600, fontSize: 13.5, fontFamily: "var(--sans)", cursor: "pointer" }}>Reagendar</button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...PAD, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 26 }}>
          {[["calendar", "Agendar"], ["clock", "Histórico"], ["folder", "Documentos"]].map(([ic, l], i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 16, padding: "16px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={ic} size={20} color="var(--accent-deep)" /></div>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{l}</span>
            </div>
          ))}
        </div>

        <div style={{ ...PAD, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
          <h3 className="serif" style={{ fontSize: 18, fontWeight: 500 }}>Serviços disponíveis</h3>
          <a style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>Ver todos</a>
        </div>
        <div style={{ display: "flex", gap: 13, overflowX: "auto", padding: "0 20px 6px" }}>
          {CLIENT_SERVICES.map((s, i) => (
            <div key={i} style={{ flex: "0 0 162px", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", background: "var(--surface)" }}>
              <PhotoSlot w="100%" h={96} radius="0" label="foto" />
              <div style={{ padding: 13 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={13} color="var(--ink-4)" />{s.d}</div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 10 }}>
                  <span><span style={{ fontSize: 11, color: "var(--ink-3)" }}>R$ </span><span className="num" style={{ fontSize: 17, fontWeight: 600 }}>{s.p}</span></span>
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={16} sw={2.2} color="#fff" /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

export default HomeDoCliente;