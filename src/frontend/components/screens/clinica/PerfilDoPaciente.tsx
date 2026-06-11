"use client";

import React from "react";
import { Icon, Btn, Avatar, PhotoSlot, CardHead } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";
import { EVOLUTION, EVO_DOT, FILES } from "@/frontend/lib/mock-data";

export function PerfilDoPaciente({ user, aprovacoesPendentes, clinicaNome, pacienteNome = "Marina Albuquerque" }: {
  user: { name: string; role: string }; aprovacoesPendentes: number; clinicaNome: string; pacienteNome?: string;
}) {
  return (
    <ClinicShell
      user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      kicker="Pacientes" title={pacienteNome}
      topRight={<>
        <Btn variant="ghost" size="sm" icon="message">Mensagem</Btn>
        <Btn variant="ghost" size="sm" icon="edit">Editar</Btn>
        <Btn size="sm" icon="plus">Novo atendimento</Btn>
      </>}
    >
      {/* hero do paciente */}
      <div style={{ background: "linear-gradient(135deg, #1357d6 0%, #1f6dff 100%)", borderRadius: 22, padding: 28, color: "#fff", position: "relative", overflow: "hidden", marginBottom: 22 }}>
        <div className="soft-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.14 }} />
        <div style={{ position: "relative", display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
          <Avatar name={pacienteNome} size={88} ring />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
              <h2 className="serif" style={{ fontSize: 26, fontWeight: 500 }}>{pacienteNome}</h2>
              <span style={{ padding: "4px 12px", background: "rgba(255,255,255,.22)", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>• Em tratamento</span>
            </div>
            <div style={{ display: "flex", gap: 18, fontSize: 13.5, opacity: 0.92, flexWrap: "wrap" }}>
              <span>32 anos</span>
              <span>(11) 98842-1190</span>
              <span>marina.alb@email.com</span>
            </div>
          </div>
        </div>

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginTop: 24, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.18)" }}>
          {[
            ["CLIENTE DESDE", "Mar 2026"],
            ["ATENDIMENTOS", "18"],
            ["ÚLTIMO PROCED.", "Microagulhamento"],
            ["TAXA DE RETORNO", "94%"],
            ["MAIS FREQUENTE", "Limpeza"],
          ].map(([l, v], i) => (
            <div key={i}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", opacity: 0.7 }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* layout 2 colunas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: 18 }}>
        {/* esquerda */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
              <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)", marginTop: 3 }}>01</span>
              <div>
                <h3 className="serif" style={{ fontSize: 17, fontWeight: 600 }}>Resumo clínico</h3>
                <p style={{ fontSize: 12, color: "var(--ink-3)" }}>sempre visível</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["alert", "ALERGIAS", "Penicilina, frutos do mar"],
                ["shield", "RESTRIÇÕES", "Gravidez (planejada)"],
                ["droplet", "MEDICAMENTOS", "Anticoncepcional"],
                ["fileText", "OBSERVAÇÕES", "Pele reativa, cuidado com ácidos"],
              ].map(([i, l, v], k) => (
                <div key={k} style={{ display: "flex", gap: 10, paddingBottom: 10, borderBottom: k < 3 ? "1px solid var(--line)" : "none" }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-tint)", color: "var(--accent-deep)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={i} size={14} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", color: "var(--ink-3)" }}>{l}</div>
                    <div style={{ fontSize: 13, color: "var(--ink)" }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14, justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)", marginTop: 3 }}>04</span>
                <div>
                  <h3 className="serif" style={{ fontSize: 17, fontWeight: 600 }}>Anamnese</h3>
                  <p style={{ fontSize: 12, color: "var(--ink-3)" }}>Atualizada em 20 mar 2026</p>
                </div>
              </div>
              <a style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600 }}>Editar →</a>
            </div>
            {["Dados gerais", "Histórico de saúde", "Hábitos", "Contraindicações"].map((l, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? "1px dashed var(--line)" : "none", fontSize: 13 }}>
                <span style={{ color: "var(--ink-2)" }}>{l}</span>
                <span style={{ color: "var(--ok)", fontWeight: 700 }}>✓</span>
              </div>
            ))}
          </div>
        </aside>

        {/* direita */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card card-pad">
            <CardHead
              title="Timeline de evolução"
              sub={`${EVOLUTION.length} registros`}
              icon="pulse"
              action={<Btn variant="quiet" size="sm" iconR="arrowRight">Ver tudo</Btn>}
            />
            <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
              <div style={{ position: "absolute", left: 5, top: 14, bottom: 10, width: 2, background: "var(--line)" }} />
              {EVOLUTION.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 18, position: "relative" }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: EVO_DOT[e.type], marginTop: 6, flexShrink: 0, border: "3px solid var(--surface)", outline: `2px solid ${EVO_DOT[e.type]}`, zIndex: 1 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <span className="eyebrow" style={{ fontSize: 11 }}>{e.date} {e.year}</span>
                      <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{e.dur}</span>
                    </div>
                    <h4 style={{ fontSize: 14.5, fontWeight: 600, margin: "2px 0" }}>{e.title}</h4>
                    <span style={{ display: "inline-block", padding: "2px 8px", background: "var(--accent-tint)", color: "var(--accent-deep)", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{e.tl}</span>
                    <p style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 8, lineHeight: 1.5 }}>{e.note}</p>
                    {e.photos > 0 && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        {Array.from({ length: e.photos }).map((_, k) => (
                          <PhotoSlot key={k} w={56} h={56} radius={10} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <CardHead title="Galeria de evolução" sub="antes / durante / depois" icon="image" action={<Btn variant="quiet" size="sm" iconR="arrowRight">Ver galeria</Btn>} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {Array.from({ length: 6 }).map((_, i) => <PhotoSlot key={i} w="100%" h={120} radius={10} label={i % 3 === 0 ? "antes" : i % 3 === 1 ? "durante" : "depois"} />)}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div className="card card-pad">
              <CardHead title="Próximos" sub="Agendamentos" icon="calendar" />
              <div style={{ fontSize: 13, color: "var(--ink-2)" }}>02 jun · Microagulhamento</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>11 jun · Limpeza</div>
            </div>
            <div className="card card-pad">
              <CardHead title="Documentos" sub={`${FILES.length} arquivos`} icon="fileText" />
              {FILES.slice(0, 3).map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 12.5 }}>
                  <Icon name={f.t === "img" ? "image" : "filePdf"} size={14} color="var(--ink-3)" />
                  <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClinicShell>
  );
}

export default PerfilDoPaciente;