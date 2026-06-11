"use client";

import React, { useState } from "react";
import { Icon, Btn, Field, Toggle } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";
import { CFG_NAV } from "@/frontend/lib/mock-data";

export function Configuracoes({ user, aprovacoesPendentes, clinicaNome }: {
  user: { name: string; role: string }; aprovacoesPendentes: number; clinicaNome: string;
}) {
  const [aba, setAba] = useState("Perfil da clínica");

  return (
    <ClinicShell user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      title="Configurações" sub="Gerencie as preferências da sua clínica"
    >
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 18, alignItems: "start" }}>
        <aside className="card" style={{ padding: 10, position: "sticky", top: 96 }}>
          {CFG_NAV.map(([icon, label], i) => (
            <div key={i} onClick={() => setAba(label as string)} className={"nav-item" + (aba === label ? " active" : "")} style={{ cursor: "pointer" }}>
              <Icon name={icon as string} size={17} sw={1.7} />
              <span style={{ flex: 1 }}>{label as string}</span>
            </div>
          ))}
        </aside>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card card-pad">
            <h2 className="serif" style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{aba}</h2>
            <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 22 }}>Estas informações aparecem para suas pacientes.</p>

            {aba === "Perfil da clínica" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 12, background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700 }}>L</div>
                  <div>
                    <Btn variant="ghost" size="sm" icon="upload">Alterar logotipo</Btn>
                    <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>PNG ou SVG, mínimo 256×256px</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Nome da clínica" placeholder="Clínica Lumière" />
                  <Field label="CNPJ" placeholder="00.000.000/0000-00" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Telefone" placeholder="(11) 99999-0000" />
                  <Field label="E-mail de contato" placeholder="contato@clinica.com" />
                </div>
                <Field label="Endereço" placeholder="Rua, número, complemento" />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                  <Btn variant="ghost" size="sm">Cancelar</Btn>
                  <Btn size="sm" icon="check">Salvar alterações</Btn>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--ink-3)", padding: "16px 0" }}>Esta seção será disponibilizada em breve.</p>
            )}
          </div>

          {aba === "Perfil da clínica" && (
            <div className="card card-pad">
              <h3 className="serif" style={{ fontSize: 17, fontWeight: 600, marginBottom: 14 }}>Preferências de agendamento</h3>
              {[
                ["Aprovação manual de agendamentos", "Solicitações do app precisam ser aprovadas", true],
                ["Permitir agendamento online", "Pacientes podem solicitar horários pelo app", true],
                ["Lembretes automáticos por WhatsApp", "Enviar 24h antes do atendimento (Pós-MVP)", false],
              ].map(([t, s, on], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 2 ? "1px solid var(--line)" : "none", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{s}</div>
                  </div>
                  <Toggle on={on as boolean} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClinicShell>
  );
}

export default Configuracoes;