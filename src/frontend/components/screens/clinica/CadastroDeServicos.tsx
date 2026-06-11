"use client";

import React, { useState } from "react";
import { Icon, Btn, Field, Toggle } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";
import { SERVICES } from "@/frontend/lib/mock-data";

export function CadastroDeServicos({ user, aprovacoesPendentes, clinicaNome }: {
  user: { name: string; role: string }; aprovacoesPendentes: number; clinicaNome: string;
}) {
  const [cat, setCat] = useState("Facial");
  return (
    <ClinicShell user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      title="Serviços" sub={`${SERVICES.filter(s => s.on).length} ativos · 3 categorias`}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, alignItems: "start" }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: 22, borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["Todos", "Facial", "Injetáveis", "Corporal"].map((c, i) => (
                <span key={i} className={"chip" + (i === 0 ? " chip-active" : "")}>{c}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 12px", borderRadius: 10, background: "var(--surface-2)", color: "var(--ink-3)", width: 220 }}>
              <Icon name="search" size={14} />
              <span style={{ fontSize: 13 }}>Buscar serviço...</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, padding: 22 }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="card" style={{ padding: 18, opacity: s.on ? 1 : 0.55, boxShadow: "none", border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-tint)", color: "var(--accent-deep)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={s.c === "Facial" ? "star" : s.c === "Injetáveis" ? "droplet" : "heart"} size={18} />
                  </span>
                  <Toggle on={s.on} />
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{s.n}</h4>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <span style={{ padding: "3px 10px", background: "var(--surface-2)", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{s.c}</span>
                  <span style={{ fontSize: 12, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={11} />{s.d}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: 10 }}>
                  <span><span style={{ fontSize: 11, color: "var(--ink-3)" }}>R$ </span><span className="num" style={{ fontSize: 22, fontWeight: 700 }}>{s.p}</span></span>
                  <button style={{ background: "none", border: 0, color: "var(--accent)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <Icon name="edit" size={13} />Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="card" style={{ padding: 22, position: "sticky", top: 96 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="plus" size={20} sw={2.5} />
            </div>
            <div>
              <h3 className="serif" style={{ fontSize: 17, fontWeight: 600 }}>Novo serviço</h3>
              <p style={{ fontSize: 12, color: "var(--ink-3)" }}>Adicione ao catálogo da clínica</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Nome do serviço" placeholder="Ex: Hidratação facial" />
            <div className="field">
              <span className="label">Categoria</span>
              <div style={{ display: "flex", gap: 6 }}>
                {["Facial", "Injetáveis", "Corporal"].map((c, i) => (
                  <span key={i} className={"chip" + (cat === c ? " chip-active" : "")} onClick={() => setCat(c)}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Duração" icon="clock" placeholder="45 min" />
              <Field label="Valor (R$)" placeholder="220,00" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, marginTop: 4, borderTop: "1px solid var(--line)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Disponível online</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>Visível para pacientes no app</div>
              </div>
              <Toggle on />
            </div>
            <Btn variant="primary" block icon="check">Salvar serviço</Btn>
          </div>
        </aside>
      </div>
    </ClinicShell>
  );
}

export default CadastroDeServicos;