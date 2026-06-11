"use client";

import React, { useState, useEffect } from "react";
import { Icon, Btn, Avatar, Pill, PhotoSlot, CardHead } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";

export function TelaDeAtendimento({ user, aprovacoesPendentes, clinicaNome }: {
  user: { name: string; role: string }; aprovacoesPendentes: number; clinicaNome: string;
}) {
  const [tempo, setTempo] = useState(0);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const t = setInterval(() => setTempo(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const horas = pad(Math.floor(tempo / 3600));
  const mins = pad(Math.floor((tempo % 3600) / 60));
  const secs = pad(tempo % 60);

  return (
    <ClinicShell
      user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      kicker="Atendimento em andamento" title="Microagulhamento — 3ª sessão"
      topRight={<>
        <Btn variant="ghost" size="sm">Salvar rascunho</Btn>
        <Btn size="sm" icon="checkCircle">Finalizar atendimento</Btn>
      </>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, alignItems: "start" }}>
        {/* col main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card card-pad" style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Avatar name="Marina Albuquerque" size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h2 className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Marina Albuquerque</h2>
                <Pill kind="warn">Em tratamento</Pill>
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)" }}>32 anos · Microagulhamento · Dra. Helena Vasconcelos</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "var(--accent)", color: "#fff", borderRadius: 999, fontFamily: "var(--serif)", fontSize: 17, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
              {horas}:{mins}:{secs}
            </div>
          </div>

          <div className="card card-pad">
            <CardHead title="Evolução do atendimento" sub="Registre o procedimento realizado" icon="edit" />
            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="Descreva o procedimento, ativos utilizados, reações observadas..."
              style={{ width: "100%", minHeight: 120, border: "1px solid var(--line-2)", borderRadius: 11, padding: "12px 14px", fontSize: 13.5, fontFamily: "inherit", resize: "vertical", color: "var(--ink)" }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {["+ Eritema leve", "+ Boa tolerância", "+ Sem intercorrências"].map((s, i) => (
                <span key={i} className="chip">{s}</span>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <CardHead title="Registro fotográfico" sub="Fotos do atendimento" icon="image" action={<Btn variant="ghost" size="sm" icon="upload">Enviar</Btn>} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              <PhotoSlot label="antes" h={140} radius={12} />
              <PhotoSlot label="durante" h={140} radius={12} />
              <PhotoSlot label="depois" h={140} radius={12} />
              <div style={{ aspectRatio: "1", border: "2px dashed var(--line-2)", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--ink-3)", cursor: "pointer" }}>
                <Icon name="plus" size={20} />
                <span style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>Adicionar</span>
              </div>
            </div>
          </div>
        </div>

        {/* col side */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 96 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--warn-tint)", color: "#9a6a2a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="alert" size={14} />
              </span>
              <h3 className="serif" style={{ fontSize: 15, fontWeight: 600 }}>Atenção clínica</h3>
            </div>
            {[
              ["Alergia", "Penicilina, frutos do mar"],
              ["Restrição", "Gravidez (planejada)"],
              ["Medicamento", "Anticoncepcional"],
            ].map(([l, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--line)" : "none", fontSize: 12.5 }}>
                <span style={{ color: "var(--ink-3)" }}>{l}</span>
                <span style={{ color: "var(--ink)", fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-tint)", color: "var(--accent-deep)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="list" size={14} />
              </span>
              <h3 className="serif" style={{ fontSize: 15, fontWeight: 600 }}>Serviço</h3>
            </div>
            {[
              ["Procedimento", "Microagulhamento"],
              ["Sessão", "3 de 6"],
              ["Duração prevista", "75 min"],
              ["Valor", "R$ 480"],
            ].map(([l, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--line)" : "none", fontSize: 12.5 }}>
                <span style={{ color: "var(--ink-3)" }}>{l}</span>
                <span style={{ color: "var(--ink)", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          <Btn variant="primary" size="lg" block icon="checkCircle">Finalizar atendimento</Btn>
        </aside>
      </div>
    </ClinicShell>
  );
}

export default TelaDeAtendimento;