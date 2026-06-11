"use client";

import React from "react";
import { Icon, Btn } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";
import { FILES } from "@/frontend/lib/mock-data";

export function UploadDeArquivos({ user, aprovacoesPendentes, clinicaNome, pacienteNome = "Marina Albuquerque" }: {
  user: { name: string; role: string }; aprovacoesPendentes: number; clinicaNome: string; pacienteNome?: string;
}) {
  return (
    <ClinicShell
      user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      kicker={`Paciente · ${pacienteNome}`} title="Arquivos"
      topRight={<>
        <Btn variant="ghost" size="sm" icon="grid">Grid</Btn>
        <Btn variant="ghost" size="sm" icon="list">Lista</Btn>
        <Btn size="sm" icon="upload">Enviar arquivo</Btn>
      </>}
    >
      <div className="card card-pad" style={{ border: "2px dashed var(--line-2)", textAlign: "center", padding: 48, marginBottom: 22, background: "var(--surface)" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-tint)", color: "var(--accent-deep)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon name="upload" size={26} />
        </div>
        <h3 className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Arraste arquivos aqui</h3>
        <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>ou clique para selecionar — até 10 MB cada</p>
        <div style={{ marginTop: 16 }}><Btn size="sm" icon="paperclip">Selecionar arquivos</Btn></div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="serif" style={{ fontSize: 17, fontWeight: 600 }}>{FILES.length} arquivos</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <span className="chip chip-active">Todos</span>
            <span className="chip">Fotos</span>
            <span className="chip">Documentos</span>
            <span className="chip">Exames</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, padding: 22 }}>
          {FILES.map((f, i) => (
            <div key={i} className="card" style={{ overflow: "hidden", boxShadow: "none", border: "1px solid var(--line)" }}>
              <div style={{ height: 120, background: f.t === "img" ? "repeating-linear-gradient(135deg, #dbe2ec 0 11px, #e4eaf2 11px 22px)" : "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={f.t === "img" ? "image" : "filePdf"} size={32} color="var(--ink-3)" />
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{f.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClinicShell>
  );
}

export default UploadDeArquivos;