"use client";

import React from "react";
import { Icon, Btn, Field, YesNo } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";
import { ANAM_STEPS } from "@/frontend/lib/mock-data";

export function Anamnese({ user, aprovacoesPendentes, clinicaNome, pacienteNome = "Marina Albuquerque" }: {
  user: { name: string; role: string }; aprovacoesPendentes: number; clinicaNome: string; pacienteNome?: string;
}) {
  return (
    <ClinicShell
      user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      kicker={`Paciente · ${pacienteNome}`} title="Anamnese clínica"
      topRight={<>
        <Btn variant="ghost" size="sm">Cancelar</Btn>
        <Btn size="sm" iconR="arrowRight">Salvar e continuar</Btn>
      </>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 22 }}>
        <aside className="card" style={{ padding: 18, alignSelf: "start", position: "sticky", top: 96 }}>
          <h3 className="serif" style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Etapas</h3>
          {ANAM_STEPS.map(([label, status], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < ANAM_STEPS.length - 1 ? "1px solid var(--line)" : "none" }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                background: status === "done" ? "var(--ok)" : status === "active" ? "var(--accent)" : "var(--surface-3)",
                color: status === "todo" ? "var(--ink-3)" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {status === "done" ? <Icon name="check" size={12} sw={2.5} color="#fff" /> : i + 1}
              </span>
              <span style={{ fontSize: 13, color: status === "active" ? "var(--ink)" : "var(--ink-2)", fontWeight: status === "active" ? 600 : 500 }}>{label}</span>
            </div>
          ))}
        </aside>

        <div className="card card-pad">
          <div style={{ marginBottom: 22 }}>
            <span className="eyebrow">Etapa 2 de 6</span>
            <h2 className="serif" style={{ fontSize: 24, fontWeight: 500, marginTop: 4 }}>Histórico de saúde</h2>
            <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 4 }}>Selecione condições e tratamentos prévios ou atuais.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {[
              ["Possui alguma alergia?", true],
              ["Está em tratamento médico atual?", false],
              ["Faz uso contínuo de medicamentos?", true],
              ["Tem alguma doença crônica?", false],
              ["Já realizou cirurgia plástica ou estética?", false],
              ["Tem histórico familiar de doenças autoimunes?", false],
            ].map(([q, yes], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, borderBottom: i < 5 ? "1px solid var(--line)" : "none" }}>
                <span style={{ fontSize: 14, color: "var(--ink)" }}>{q as string}</span>
                <YesNo yes={yes as boolean} />
              </div>
            ))}

            <Field label="Descreva quaisquer condições relevantes" placeholder="Detalhe alergias, medicamentos ou tratamentos..." />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
            <Btn variant="ghost" size="sm" icon="chevronLeft">Voltar</Btn>
            <Btn size="sm" iconR="arrowRight">Salvar e continuar</Btn>
          </div>
        </div>
      </div>
    </ClinicShell>
  );
}

export default Anamnese;