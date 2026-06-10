"use client";

import { useState, useEffect, type FormEvent } from "react";
import type { AtendimentoComRefs } from "@/backend/services/atendimentoService";
import type { EvolucaoComAutor } from "@/backend/services/evolucaoService";
import type { FotoComUrl } from "@/backend/services/fotoClinicaService";
import type { Anamnese } from "@/backend/services/anamneseService";
import styles from "./AtendimentoAtivo.module.css";

interface AtendimentoAtivoProps {
  atendimento: AtendimentoComRefs;
  anamnese: Anamnese | null;
  evolucoes: EvolucaoComAutor[];
  fotos: FotoComUrl[];
  createEvolucaoAction: (formData: FormData) => Promise<{ error?: string }>;
  uploadFotoAction: (formData: FormData) => Promise<{ error?: string }>;
  finalizarAction: (formData: FormData) => Promise<unknown>;
  cancelarAction: (formData: FormData) => Promise<unknown>;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

function formatTimer(ms: number): string {
  const sec = Math.floor(ms / 1000);
  return `${pad(Math.floor(sec / 3600))}:${pad(Math.floor((sec % 3600) / 60))}:${pad(sec % 60)}`;
}

function idade(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  return `${Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))} anos`;
}

function inicial(nome: string): string {
  const p = nome.trim().split(" ").filter(Boolean);
  if (p.length === 0) return "?";
  return ((p[0][0] ?? "") + (p[p.length - 1]?.[0] ?? "")).toUpperCase();
}

const SUGESTOES = ["Eritema leve", "Boa tolerância", "Sem intercorrências"];

export function AtendimentoAtivo({ atendimento, anamnese, evolucoes, fotos, createEvolucaoAction, uploadFotoAction, finalizarAction, cancelarAction }: AtendimentoAtivoProps) {
  const emAndamento = atendimento.status === "em_andamento";
  const [tempo, setTempo] = useState(0);
  const [enviandoEv, setEnviandoEv] = useState(false);
  const [textoEv, setTextoEv] = useState("");
  const [finalizando, setFinalizando] = useState(false);

  useEffect(() => {
    if (!emAndamento) {
      setTempo(0);
      return;
    }
    const inicio = new Date(atendimento.data_hora_inicio).getTime();
    const tick = () => setTempo(Date.now() - inicio);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [atendimento.data_hora_inicio, emAndamento]);

  const saude = (anamnese?.saude ?? {}) as Record<string, unknown>;
  const contraindicacoes = (anamnese?.contraindicacoes ?? {}) as Record<string, unknown>;

  async function handleSubmitEv(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!textoEv.trim()) return;
    setEnviandoEv(true);
    const fd = new FormData();
    fd.set("titulo", textoEv.split("\n")[0].slice(0, 60));
    fd.set("descricao", textoEv);
    fd.set("tipo", "procedimento");
    await createEvolucaoAction(fd);
    setTextoEv("");
    setEnviandoEv(false);
  }

  function adicionarSugestao(s: string) {
    setTextoEv((prev) => prev + (prev ? "\n" : "") + s);
  }

  async function handleFinalizar() {
    setFinalizando(true);
    await finalizarAction(new FormData());
  }

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <span className={styles.eyebrow}>ATENDIMENTO {emAndamento ? "EM ANDAMENTO" : "ENCERRADO"}</span>
          <h1 className={styles.titulo}>{atendimento.servico?.nome ?? "Atendimento"}</h1>
        </div>
        {emAndamento && (
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={async () => { await cancelarAction(new FormData()); }}
              className={styles.btnGhost}
            >
              Cancelar
            </button>
            <button type="button" onClick={handleFinalizar} disabled={finalizando} className={styles.btnPrimary}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
              {finalizando ? "Finalizando..." : "Finalizar atendimento"}
            </button>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.colMain}>
          <section className={styles.cardPaciente}>
            <div className={styles.pacAvatar}>{inicial(atendimento.paciente?.nome_completo ?? "")}</div>
            <div className={styles.pacInfo}>
              <div className={styles.pacTitleRow}>
                <h2 className={styles.pacNome}>{atendimento.paciente?.nome_completo ?? "—"}</h2>
                <span className={styles.pacStatus}>• Em tratamento</span>
              </div>
              <p className={styles.pacMeta}>
                {idade(null)} · {atendimento.servico?.nome ?? "—"} · {atendimento.profissional?.nome_completo ?? "—"}
              </p>
            </div>
            <div className={styles.timer}>
              <span className={styles.timerDot} />
              {formatTimer(tempo)}
            </div>
          </section>

          <section className={styles.cardEvolucao}>
            <header className={styles.cardEvHead}>
              <span className={styles.cardIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </span>
              <div>
                <h2 className={styles.cardTitle}>Evolução do atendimento</h2>
                <p className={styles.cardSub}>Registre o procedimento realizado</p>
              </div>
            </header>

            {emAndamento && (
              <form onSubmit={handleSubmitEv} className={styles.evForm}>
                <textarea
                  value={textoEv}
                  onChange={(e) => setTextoEv(e.target.value)}
                  placeholder="Descreva o procedimento, ativos utilizados, reações..."
                  className={styles.textarea}
                  rows={5}
                />
                <div className={styles.sugestoes}>
                  {SUGESTOES.map((s) => (
                    <button key={s} type="button" onClick={() => adicionarSugestao(s)} className={styles.sugestao}>
                      + {s}
                    </button>
                  ))}
                </div>
                <button type="submit" disabled={enviandoEv || !textoEv.trim()} className={styles.btnSalvarEv}>
                  {enviandoEv ? "Salvando..." : "Salvar evolução"}
                </button>
              </form>
            )}

            {evolucoes.length > 0 && (
              <div className={styles.evList}>
                {evolucoes.map((e) => (
                  <div key={e.id} className={styles.evItem}>
                    <div className={styles.evItemHead}>
                      <strong>{e.titulo}</strong>
                      <span className={styles.evHora}>{new Date(e.data_hora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    {e.descricao && <p className={styles.evDesc}>{e.descricao}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={styles.cardFotos}>
            <header className={styles.cardEvHead}>
              <span className={styles.cardIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </span>
              <div>
                <h2 className={styles.cardTitle}>Registro fotográfico</h2>
                <p className={styles.cardSub}>Fotos do atendimento</p>
              </div>
              {emAndamento && (
                <label className={styles.btnUpload}>
                  <input type="file" accept="image/*" hidden onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.set("file", file);
                    fd.set("tipo", "durante");
                    await uploadFotoAction(fd);
                  }} />
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Enviar
                </label>
              )}
            </header>

            <div className={styles.fotosGrid}>
              {["antes", "durante", "depois"].map((tipo) => {
                const foto = fotos.find((f) => f.tipo === tipo);
                return (
                  <div key={tipo} className={styles.fotoSlot}>
                    {foto?.signed_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={foto.signed_url} alt={tipo} className={styles.fotoImg} />
                    ) : (
                      <span className={styles.fotoLabel}>{tipo}</span>
                    )}
                  </div>
                );
              })}
              {emAndamento && (
                <label className={styles.fotoSlotAdd}>
                  <input type="file" accept="image/*" hidden onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.set("file", file);
                    fd.set("tipo", "durante");
                    await uploadFotoAction(fd);
                  }} />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Adicionar</span>
                </label>
              )}
            </div>
          </section>
        </div>

        <aside className={styles.colSide}>
          <section className={styles.sideCard}>
            <header className={styles.sideHead}>
              <span className={styles.sideIcon} style={{ background: "var(--warn-tint)", color: "var(--warn)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </span>
              <h3 className={styles.sideTitle}>Atenção clínica</h3>
            </header>
            <div className={styles.sideList}>
              <SideLine label="Alergia" value={String(saude.alergias ?? "Nenhuma")} />
              <SideLine label="Restrição" value={String(contraindicacoes.restricoes ?? "Nenhuma")} />
              <SideLine label="Medicamento" value={String(saude.medicamentos ?? "Nenhum")} />
            </div>
          </section>

          <section className={styles.sideCard}>
            <header className={styles.sideHead}>
              <span className={styles.sideIcon} style={{ background: "var(--brand-tint)", color: "var(--brand-deep)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </span>
              <h3 className={styles.sideTitle}>Serviço</h3>
            </header>
            <div className={styles.sideList}>
              <SideLine label="Procedimento" value={atendimento.servico?.nome ?? "—"} />
              <SideLine label="Duração prevista" value={atendimento.servico?.duracao_minutos ? `${atendimento.servico.duracao_minutos} min` : "—"} />
              <SideLine label="Profissional" value={atendimento.profissional?.nome_completo ?? "—"} />
            </div>
          </section>

          {emAndamento && (
            <button type="button" onClick={handleFinalizar} disabled={finalizando} className={styles.btnFinalizar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
              {finalizando ? "Finalizando..." : "Finalizar atendimento"}
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

function SideLine({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.sideLine}>
      <span className={styles.sideLabel}>{label}</span>
      <span className={styles.sideValue}>{value}</span>
    </div>
  );
}