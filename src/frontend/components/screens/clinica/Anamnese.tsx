"use client";

import React, { useState } from "react";
import { Icon, Btn } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";

type PerguntaTipo = "yesno" | "options";

interface Pergunta {
  id: string;
  q: string;
  tipo: PerguntaTipo;
  options?: string[];
  detalheSeSim?: boolean;
}

interface EtapaData {
  id: number;
  label: string;
  title: string;
  sub: string;
  perguntas: Pergunta[];
  obs?: boolean;
  obsPlaceholder?: string;
  termo?: boolean;
}

const ETAPAS: EtapaData[] = [
  {
    id: 1, label: "Dados gerais", title: "Dados gerais",
    sub: "Informações básicas sobre o perfil da paciente.",
    perguntas: [
      { id: "tipo_pele", q: "Qual seu tipo de pele?", tipo: "options", options: ["Seca", "Mista", "Oleosa"] },
      { id: "fototipo", q: "Qual seu fototipo?", tipo: "options", options: ["I", "II", "III", "IV", "V", "VI"] },
      { id: "fumante", q: "É fumante?", tipo: "yesno" },
      { id: "exercicios", q: "Pratica exercícios físicos regularmente?", tipo: "yesno" },
      { id: "alcool", q: "Consome álcool com frequência?", tipo: "yesno" },
    ],
    obs: true,
  },
  {
    id: 2, label: "Histórico de saúde", title: "Histórico de saúde",
    sub: "Informações importantes para a segurança dos procedimentos.",
    perguntas: [
      { id: "doenca_cronica", q: "Possui alguma doença crônica?", tipo: "yesno", detalheSeSim: true },
      { id: "medicamento_continuo", q: "Faz uso de medicamento contínuo?", tipo: "yesno", detalheSeSim: true },
      { id: "alergia", q: "Possui alergia a anestésicos ou cosméticos?", tipo: "yesno", detalheSeSim: true },
      { id: "cirurgia_12m", q: "Já realizou cirurgia nos últimos 12 meses?", tipo: "yesno", detalheSeSim: true },
      { id: "gestante", q: "Está gestante ou amamentando?", tipo: "yesno" },
      { id: "marca_passo", q: "Possui marca-passo ou implante metálico?", tipo: "yesno" },
    ],
    obs: true,
    obsPlaceholder: "Descreva qualquer informação relevante sobre o histórico de saúde da paciente…",
  },
  {
    id: 3, label: "Medicamentos", title: "Medicamentos",
    sub: "Uso de medicamentos atual e recente.",
    perguntas: [
      { id: "isotretinoina", q: "Já usou isotretinoína nos últimos 12 meses?", tipo: "yesno", detalheSeSim: true },
      { id: "anticoagulante", q: "Faz uso de anticoagulantes?", tipo: "yesno", detalheSeSim: true },
      { id: "acido_topico", q: "Usa ácido salicílico ou retinóide tópico?", tipo: "yesno" },
      { id: "suplemento", q: "Faz uso de suplementos ou vitaminas?", tipo: "yesno" },
    ],
    obs: true,
  },
  {
    id: 4, label: "Hábitos de vida", title: "Hábitos de vida",
    sub: "Rotina diária e cuidados pessoais.",
    perguntas: [
      { id: "agua", q: "Como é sua ingestão diária de água?", tipo: "options", options: ["Baixa", "Regular", "Alta"] },
      { id: "sol", q: "Como é sua exposição solar?", tipo: "options", options: ["Baixa", "Moderada", "Alta"] },
      { id: "skincare", q: "Pratica skincare regularmente?", tipo: "yesno" },
      { id: "sono", q: "Costuma dormir bem (mínimo 7h)?", tipo: "yesno" },
    ],
    obs: true,
  },
  {
    id: 5, label: "Contraindicações", title: "Contraindicações",
    sub: "Sensibilidades e restrições para procedimentos.",
    perguntas: [
      { id: "sens_salicilico", q: "Sensível a ácido salicílico?", tipo: "yesno", detalheSeSim: true },
      { id: "sens_anestesico", q: "Sensível a algum anestésico?", tipo: "yesno", detalheSeSim: true },
      { id: "queloide", q: "Tem tendência a queloide?", tipo: "yesno" },
      { id: "herpes", q: "Tem herpes labial recorrente?", tipo: "yesno" },
    ],
    obs: true,
  },
  {
    id: 6, label: "Termo de consentimento", title: "Termo de consentimento",
    sub: "Leia e aceite os termos antes de finalizar a anamnese.",
    perguntas: [], termo: true,
  },
];

function OptionsToggle({ options, value, onChange }: { options: string[]; value?: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "inline-flex", border: "1px solid var(--line)", borderRadius: 999, padding: 3, background: "var(--surface)" }}>
      {options.map((o) => {
        const active = value === o;
        return (
          <button key={o} type="button" onClick={() => onChange(o)} style={{
            padding: "8px 16px", border: 0, borderRadius: 999, cursor: "pointer",
            background: active ? "var(--ink)" : "transparent",
            color: active ? "#fff" : "var(--ink-3)",
            fontSize: 13.5, fontWeight: active ? 600 : 500,
            fontFamily: "inherit",
          }}>{o}</button>
        );
      })}
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <span onClick={() => onChange(!checked)} style={{
      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
      border: checked ? "none" : "1.5px solid var(--line-2)",
      background: checked ? "var(--accent)" : "var(--surface)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", marginTop: 1,
    }}>
      {checked && <Icon name="check" size={13} sw={2.6} color="#fff" />}
    </span>
  );
}

export function Anamnese({ user, aprovacoesPendentes, clinicaNome, pacienteNome = "MARINA ALBUQUERQUE", etapaInicial = 2 }: {
  user: { name: string; role: string }; aprovacoesPendentes: number; clinicaNome: string; pacienteNome?: string; etapaInicial?: number;
}) {
  const [etapa, setEtapa] = useState(etapaInicial);
  const [respostas, setRespostas] = useState<Record<string, string>>({
    medicamento_continuo: "sim",
    alergia: "sim",
    doenca_cronica: "nao",
    cirurgia_12m: "nao",
    gestante: "nao",
    marca_passo: "nao",
  });
  const [detalhes, setDetalhes] = useState<Record<string, string>>({
    medicamento_continuo: "Anticoncepcional oral",
    alergia: "Lidocaína — reação cutânea leve",
  });
  const [obs, setObs] = useState<Record<number, string>>({});
  const [aceiteTermo, setAceiteTermo] = useState(false);
  const [autorizoFotos, setAutorizoFotos] = useState(false);

  const data = ETAPAS[etapa - 1];

  function setResposta(id: string, v: string) {
    setRespostas((r) => ({ ...r, [id]: v }));
  }
  function setDetalhe(id: string, v: string) {
    setDetalhes((d) => ({ ...d, [id]: v }));
  }
  function avancar() { if (etapa < 6) setEtapa(etapa + 1); }
  function voltar() { if (etapa > 1) setEtapa(etapa - 1); }

  const progressPct = (etapa / ETAPAS.length) * 100;

  return (
    <ClinicShell
      user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      kicker={pacienteNome} title="Anamnese"
      topRight={<>
        <Btn variant="ghost" size="sm">Salvar e sair</Btn>
        <Btn size="sm" iconR="chevronRight" onClick={avancar}>Continuar</Btn>
      </>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 18, alignItems: "start" }}>

        {/* STEPPER */}
        <div className="card card-pad">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span className="eyebrow" style={{ fontSize: 11 }}>PROGRESSO</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>{etapa} de 6</span>
          </div>
          <div style={{ height: 5, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden", marginBottom: 22 }}>
            <div style={{ width: `${progressPct}%`, height: "100%", background: "var(--accent)", transition: "width .3s" }} />
          </div>

          <div>
            {ETAPAS.map((e) => {
              const status: "done" | "active" | "pending" = e.id < etapa ? "done" : e.id === etapa ? "active" : "pending";
              return (
                <div key={e.id} onClick={() => setEtapa(e.id)} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 0", cursor: "pointer",
                }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: status === "pending" ? "var(--surface)" : "var(--accent)",
                    color: status === "pending" ? "var(--ink-3)" : "#fff",
                    border: status === "pending" ? "1.5px solid var(--line-2)" : "none",
                    fontSize: 12, fontWeight: 600, flexShrink: 0,
                  }}>
                    {status === "done" ? <Icon name="check" size={14} sw={2.6} color="#fff" /> : e.id}
                  </span>
                  <span style={{
                    fontSize: 14,
                    fontWeight: status === "active" ? 600 : 500,
                    color: status === "pending" ? "var(--ink-3)" : "var(--ink)",
                  }}>{e.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* FORM */}
        <div className="card card-pad" style={{ padding: 32 }}>
          <div className="eyebrow" style={{ fontSize: 11.5, marginBottom: 6 }}>ETAPA {etapa}</div>
          <h2 className="serif" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.02em", marginBottom: 8 }}>{data.title}</h2>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 28 }}>{data.sub}</p>

          {/* perguntas */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {data.perguntas.map((p) => {
              const v = respostas[p.id];
              const showDetalhe = p.tipo === "yesno" && p.detalheSeSim && v === "sim";

              return (
                <div key={p.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <label style={{ fontSize: 14.5, color: "var(--ink-2)", flex: 1 }}>{p.q}</label>
                    {p.tipo === "yesno" ? (
                      <OptionsToggle options={["Sim", "Não"]} value={v === "sim" ? "Sim" : v === "nao" ? "Não" : undefined} onChange={(o) => setResposta(p.id, o === "Sim" ? "sim" : "nao")} />
                    ) : (
                      <OptionsToggle options={p.options ?? []} value={v} onChange={(o) => setResposta(p.id, o)} />
                    )}
                  </div>

                  {showDetalhe && (
                    <div style={{ marginTop: 12 }}>
                      <input
                        type="text"
                        value={detalhes[p.id] ?? ""}
                        onChange={(e) => setDetalhe(p.id, e.target.value)}
                        placeholder="Descreva..."
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "1px solid var(--line)",
                          borderRadius: 12,
                          background: "var(--surface-2)",
                          fontSize: 14,
                          fontFamily: "inherit",
                          color: "var(--ink)",
                          outline: "none",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* TERMO (etapa 6) */}
            {data.termo && (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <div style={{ padding: 20, background: "var(--surface-2)", borderRadius: 14, border: "1px solid var(--line)" }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Termo de consentimento</h4>
                  <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6 }}>
                    Declaro estar ciente sobre os procedimentos estéticos a serem realizados, suas indicações, contraindicações,
                    cuidados pré e pós, possíveis reações e a necessidade de seguir as recomendações da equipe clínica para o
                    melhor resultado do tratamento.
                  </p>
                </div>

                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <Checkbox checked={aceiteTermo} onChange={setAceiteTermo} />
                  <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>Li e aceito os termos de consentimento para os procedimentos estéticos.</span>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <Checkbox checked={autorizoFotos} onChange={setAutorizoFotos} />
                  <span style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>Autorizo o uso das fotos clínicas para acompanhamento e evolução do tratamento.</span>
                </label>
              </div>
            )}

            {/* OBSERVAÇÕES */}
            {data.obs && (
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "var(--ink-2)" }}>
                  Observações adicionais
                </label>
                <textarea
                  value={obs[etapa] ?? ""}
                  onChange={(e) => setObs({ ...obs, [etapa]: e.target.value })}
                  placeholder={data.obsPlaceholder ?? "Descreva qualquer observação relevante sobre esta etapa…"}
                  style={{
                    width: "100%",
                    minHeight: 96,
                    padding: "14px 16px",
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    background: "var(--surface)",
                    fontSize: 14,
                    fontFamily: "inherit",
                    color: "var(--ink)",
                    resize: "vertical",
                    outline: "none",
                    lineHeight: 1.5,
                  }}
                />
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
            <Btn variant="ghost" icon="chevronLeft" onClick={voltar} disabled={etapa === 1}>Voltar</Btn>
            <Btn iconR="chevronRight" onClick={avancar}>
              {etapa === 6 ? "Finalizar anamnese" : "Salvar e continuar"}
            </Btn>
          </div>
        </div>
      </div>
    </ClinicShell>
  );
}

export default Anamnese;