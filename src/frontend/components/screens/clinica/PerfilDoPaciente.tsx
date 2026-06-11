"use client";

import React from "react";
import { Icon, Btn, IconBtn, Avatar, Pill, PhotoSlot } from "@/frontend/components/ui";
import { ClinicShell } from "@/frontend/components/clinica/Shell";

const EVOLUTIONS = [
  {
    date: "28 mai", year: "2026", title: "Retorno — avaliação de evolução",
    prof: "Dra. Helena Vasconcelos", dur: "30 min", tag: "Retorno",
    note: "Pele com textura visivelmente mais uniforme. Redução das manchas na zona T. Mantida rotina de skincare domiciliar. Próxima sessão de microagulhamento agendada.",
    photos: 2, dotFilled: true,
  },
  {
    date: "03 mai", year: "2026", title: "Microagulhamento — 2ª sessão",
    prof: "Dra. Helena Vasconcelos", dur: "1h 15min", tag: "Procedimento",
    note: "Procedimento realizado sem intercorrências. Aplicado protocolo com ativos de vitamina C. Orientado uso de fotoprotetor e evitar exposição solar por 72h.",
    photos: 3, dotFilled: false,
  },
  {
    date: "12 abr", year: "2026", title: "Limpeza de pele profunda",
    prof: "Camila Rocha", dur: "50 min", tag: "Procedimento",
    note: "Extração de comedões e hidratação. Pele reativa na região malar, sem sinais de irritação ao final. Boa tolerância ao procedimento.",
    photos: 2, dotFilled: false,
  },
  {
    date: "20 mar", year: "2026", title: "Avaliação inicial e anamnese",
    prof: "Dra. Helena Vasconcelos", dur: "45 min", tag: "Avaliação",
    note: "Primeira consulta. Queixa principal: manchas e textura irregular. Definido plano de tratamento com limpeza de pele e microagulhamento seriado.",
    photos: 0, dotFilled: false,
  },
];

const ANAMNESE_SECOES: [string, string, [string, string][]][] = [
  ["droplet", "Dados gerais", [["Tipo de pele", "Mista"], ["Fototipo", "III"], ["Fumante", "Não"]]],
  ["heart", "Histórico de saúde", [["Doenças crônicas", "Nenhuma"], ["Cirurgias", "Nenhuma"], ["Gestante", "Não"]]],
  ["droplet", "Hábitos", [["Ingestão de água", "Regular"], ["Exposição solar", "Moderada"], ["Skincare", "Diário"]]],
  ["alert", "Contraindicações", [["Ácido salicílico", "Sensível"], ["Anestésico", "Lidocaína"]]],
];

const DOCUMENTOS: [string, string, boolean][] = [
  ["Termo de consentimento", "PDF · 240 KB · 20 mar 2026", true],
  ["Ficha de anamnese", "PDF · 180 KB · 20 mar 2026", true],
  ["Exame dermatológico", "PDF · 1,2 MB · 18 mar 2026", false],
  ["Fotos de evolução.zip", "14 imagens · 8,4 MB", false],
];

export function PerfilDoPaciente({ user, aprovacoesPendentes, clinicaNome, pacienteNome = "Marina Albuquerque" }: {
  user: { name: string; role: string }; aprovacoesPendentes: number; clinicaNome: string; pacienteNome?: string;
}) {
  return (
    <ClinicShell
      user={user} aprovacoesPendentes={aprovacoesPendentes} clinicaNome={clinicaNome}
      kicker="PACIENTES" title="Perfil do paciente"
      topRight={<>
        <Btn variant="ghost" size="sm" icon="message">Mensagem</Btn>
        <IconBtn name="edit" />
        <IconBtn name="moreH" />
      </>}
    >
      {/* HERO CARD */}
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ height: 64, background: "var(--accent)", position: "relative", overflow: "hidden" }}>
          <div className="soft-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.18 }} />
        </div>
        <div style={{ padding: "0 28px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 22 }}>
            <div style={{ marginTop: -50, flexShrink: 0 }}>
              <PhotoSlot w={120} h={120} radius="50%" label="foto" style={{ border: "5px solid var(--surface)" }} />
            </div>

            <div style={{ flex: 1, paddingTop: 18, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <h2 className="serif" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.02em" }}>{pacienteNome}</h2>
                <Pill kind="warn">Em tratamento</Pill>
              </div>
              <div style={{ display: "flex", gap: 24, fontSize: 13.5, color: "var(--ink-3)", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="user" size={14} />34 anos</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="phone" size={14} />(11) 98842-1190</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="mail" size={14} />marina.alb@email.com</span>
              </div>
            </div>

            <div style={{ paddingTop: 18, textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 13, color: "var(--ink-3)" }}>28 mai · Retorno</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", marginTop: 4 }}>30 mai · 17:00</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 22, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <Btn size="sm" icon="plus">Novo atendimento</Btn>
            <Btn variant="ghost" size="sm" icon="camera">Nova foto</Btn>
            <Btn variant="ghost" size="sm" icon="paperclip">Novo anexo</Btn>
            <Btn variant="ghost" size="sm" icon="calendar">Agendar</Btn>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20, marginTop: 24, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
            {[
              ["CLIENTE DESDE", "Maio 2025"],
              ["ATENDIMENTOS", "18"],
              ["ÚLTIMO PROCEDIMENTO", "Botox"],
              ["TAXA DE RETORNO", "100%"],
              ["MAIS FREQUENTE", "Limpeza de pele"],
            ].map(([l, v], i) => (
              <div key={i}>
                <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>{l}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2 COLUNAS */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: 18, alignItems: "start" }}>

        {/* ---- COL ESQUERDA ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* 01 RESUMO CLÍNICO */}
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)" }}>01</span>
              <Icon name="pulse" size={18} color="var(--accent)" />
              <h3 className="serif" style={{ fontSize: 18, fontWeight: 600, flex: 1 }}>Resumo clínico</h3>
              <span style={{ fontSize: 11, color: "var(--ink-3)" }}>sempre visível</span>
            </div>

            {[
              ["alert", "QUEIXAS PRINCIPAIS", "Manchas e textura irregular na zona T; linhas finas de expressão."],
              ["droplet", "ALERGIAS", "Lidocaína — reação cutânea leve."],
              ["shield", "RESTRIÇÕES", "Sensibilidade a ácido salicílico. Evitar exposição solar pós-procedimento."],
              ["fileText", "MEDICAMENTOS EM USO", "Anticoncepcional oral. Isotretinoína suspensa há 8 meses."],
            ].map(([icon, label, value], i) => (
              <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid var(--line)" }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: "var(--accent-tint)", color: "var(--accent-deep)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={15} />
                </span>
                <div style={{ flex: 1 }}>
                  <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5 }}>{value}</div>
                </div>
              </div>
            ))}

            <div>
              <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 6 }}>OBSERVAÇÕES PROFISSIONAIS</div>
              <p style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.5 }}>
                Paciente colaborativa e assídua à rotina domiciliar. Boa resposta ao tratamento. Avaliar intervalo entre sessões de microagulhamento.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
                <Avatar name="Helena Vasconcelos" size={24} fontScale={0.38} />
                <span style={{ fontSize: 12, color: "var(--ink-3)" }}>Dra. Helena · atualizado 28 mai</span>
              </div>
            </div>
          </div>

          {/* 04 ANAMNESE */}
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)" }}>04</span>
              <h3 className="serif" style={{ fontSize: 18, fontWeight: 600, flex: 1 }}>Anamnese</h3>
              <a style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>Completa →</a>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 16, marginLeft: 28 }}>Atualizada em 12 abr 2026</div>

            {ANAMNESE_SECOES.map(([icon, title, items], i) => (
              <div key={i} style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 16, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Icon name={icon} size={15} color="var(--ink-3)" />
                  <h4 style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</h4>
                </div>
                {items.map(([k, v], k2) => (
                  <div key={k2} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, borderTop: k2 > 0 ? "1px dashed var(--line)" : "none" }}>
                    <span style={{ color: "var(--ink-3)" }}>{k}</span>
                    <span style={{ color: "var(--ink)", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---- COL DIREITA ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* 02 TIMELINE */}
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22, gap: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)", marginTop: 4 }}>02</span>
                <div>
                  <h3 className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Timeline de evolução</h3>
                  <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>Jornada completa da paciente</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" size="sm" icon="filter">Filtrar</Btn>
                <Btn variant="ghost" size="sm" iconR="chevronDown">Tudo</Btn>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 5, top: 14, bottom: 10, width: 2, background: "var(--line)" }} />
              {EVOLUTIONS.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 18, paddingBottom: 22, position: "relative" }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: e.dotFilled ? "var(--accent)" : "var(--surface)",
                    border: e.dotFilled ? "none" : "2px solid var(--accent)",
                    marginTop: 6, flexShrink: 0,
                    boxShadow: "0 0 0 3px var(--surface)",
                    zIndex: 1,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {e.date} <span style={{ color: "var(--ink-4)", fontWeight: 400 }}>{e.year}</span>
                      </div>
                      <Pill kind="muted">{e.tag}</Pill>
                    </div>
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{e.title}</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--ink-3)", marginBottom: 10 }}>
                      <Avatar name={e.prof} size={20} fontScale={0.4} />
                      <span>{e.prof}</span>
                      <span>·</span>
                      <span>{e.dur}</span>
                    </div>
                    {e.photos > 0 && (
                      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                        {Array.from({ length: e.photos }).map((_, k) => <PhotoSlot key={k} w={66} h={66} radius={9} label="foto" />)}
                      </div>
                    )}
                    <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 11, padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <Icon name="fileText" size={12} color="var(--ink-3)" />
                        <span className="eyebrow" style={{ fontSize: 10 }}>OBSERVAÇÕES</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}>{e.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 03 GALERIA */}
          <div className="card card-pad">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 4 }}>
              <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)", marginTop: 4 }}>03</span>
              <div>
                <h3 className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Galeria de evolução</h3>
                <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>Comparativo antes · durante · depois</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, margin: "14px 0 16px", marginLeft: 28 }}>
              <span className="chip chip-active">Microagulhamento</span>
              <span className="chip">Limpeza de pele</span>
              <span className="chip">Todas as fotos · 14</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                ["Antes", "20 mar", "foto · antes", false],
                ["Durante", "03 mai", "foto · durante", false],
                ["Depois", "28 mai", "foto · depois", true],
              ].map(([label, date, tag, highlight], i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: highlight ? "var(--accent)" : "var(--ink-2)", fontWeight: 600 }}>{label as string}</span>
                    <span style={{ color: "var(--ink-3)" }}>{date as string}</span>
                  </div>
                  <PhotoSlot h={170} radius={12} label={tag as string} />
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 10 }}>
              {Array.from({ length: 6 }).map((_, i) => <PhotoSlot key={i} h={62} radius={9} />)}
              <div style={{ height: 62, borderRadius: 9, background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "var(--ink-2)" }}>+8</div>
            </div>
          </div>

          {/* 05 + 06 lado a lado */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {/* 05 AGENDAMENTOS */}
            <div className="card card-pad">
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
                <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)" }}>05</span>
                <h3 className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Agendamentos</h3>
              </div>

              <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 10 }}>PRÓXIMOS</div>
              <div style={{ background: "var(--accent-tint)", borderRadius: 12, padding: 14, display: "flex", gap: 14, marginBottom: 18, alignItems: "center" }}>
                <div style={{ textAlign: "center", flexShrink: 0, lineHeight: 1 }}>
                  <div className="num" style={{ fontSize: 24, fontWeight: 700, color: "var(--accent-deep)" }}>30</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-deep)", letterSpacing: ".06em", marginTop: 4 }}>MAI</div>
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>Microagulhamento — 3ª sessão</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3 }}>17:00 · Dra. Helena</div>
                </div>
              </div>

              <div className="eyebrow" style={{ fontSize: 10.5, marginBottom: 10 }}>HISTÓRICO</div>
              {[
                ["28 mai", "Retorno"],
                ["03 mai", "Microagulhamento"],
                ["12 abr", "Limpeza de pele"],
              ].map(([d, t], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", fontSize: 13, borderBottom: i < 2 ? "1px solid var(--line)" : "none" }}>
                  <Icon name="checkCircle" size={16} color="var(--accent)" />
                  <span style={{ color: "var(--ink-3)", width: 50 }}>{d}</span>
                  <span style={{ color: "var(--ink)" }}>{t}</span>
                </div>
              ))}
            </div>

            {/* 06 DOCUMENTOS */}
            <div className="card card-pad">
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
                <span className="num" style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)" }}>06</span>
                <h3 className="serif" style={{ fontSize: 18, fontWeight: 600 }}>Documentos</h3>
              </div>

              {DOCUMENTOS.map(([nome, meta, signed], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: i > 0 ? "1px solid var(--line)" : "none" }}>
                  <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="fileText" size={16} color="var(--ink-3)" />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nome}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{meta}</div>
                  </div>
                  {signed && <Pill kind="ok">Assinado</Pill>}
                  <button style={{ background: "none", border: 0, color: "var(--ink-3)", cursor: "pointer", padding: 6, display: "flex", alignItems: "center" }}>
                    <Icon name="download" size={16} />
                  </button>
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