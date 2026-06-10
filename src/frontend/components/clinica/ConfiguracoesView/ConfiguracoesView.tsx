"use client";

import { useState, type FormEvent } from "react";
import styles from "./ConfiguracoesView.module.css";

interface ClinicaData {
  id: string;
  nome: string | null;
  cnpj: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  cep: string | null;
  logo_url: string | null;
}

interface ConfiguracoesViewProps {
  clinica: ClinicaData;
  updateAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

type Aba = "perfil" | "horarios" | "notificacoes" | "equipe" | "integracoes" | "seguranca" | "faturamento";

const ABAS: { id: Aba; label: string; icon: React.ReactNode }[] = [
  { id: "perfil", label: "Perfil da clínica", icon: <IconUser /> },
  { id: "horarios", label: "Horários de funcionamento", icon: <IconClock /> },
  { id: "notificacoes", label: "Notificações", icon: <IconBell /> },
  { id: "equipe", label: "Equipe e permissões", icon: <IconUsers /> },
  { id: "integracoes", label: "Integrações", icon: <IconPlug /> },
  { id: "seguranca", label: "Segurança", icon: <IconShield /> },
  { id: "faturamento", label: "Faturamento", icon: <IconFile /> },
];

export function ConfiguracoesView({ clinica, updateAction }: ConfiguracoesViewProps) {
  const [aba, setAba] = useState<Aba>("perfil");
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const result = await updateAction(fd);
    setEnviando(false);
    if (result.error) setMsg({ tipo: "erro", texto: result.error });
    else if (result.success) setMsg({ tipo: "ok", texto: "Alterações salvas." });
  }

  const inicial = (clinica.nome ?? "C")[0]?.toUpperCase();

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.titulo}>Configurações</h1>
          <p className={styles.subtitulo}>Gerencie as preferências da sua clínica</p>
        </div>
      </div>

      <div className={styles.grid}>
        <nav className={styles.abas}>
          {ABAS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAba(a.id)}
              className={`${styles.aba} ${aba === a.id ? styles.abaActive : ""}`}
            >
              <span className={styles.abaIcon}>{a.icon}</span>
              <span>{a.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.painel}>
          {aba === "perfil" && (
            <>
              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Perfil da clínica</h2>
                <p className={styles.cardSub}>Estas informações aparecem para suas pacientes.</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  {msg && (
                    <div className={msg.tipo === "ok" ? styles.msgOk : styles.msgErr}>{msg.texto}</div>
                  )}

                  <div className={styles.logoRow}>
                    <div className={styles.logoBox}>
                      <span className={styles.logoLetra}>{inicial}</span>
                    </div>
                    <div>
                      <button type="button" className={styles.btnSecondary}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        Alterar logotipo
                      </button>
                      <p className={styles.hint}>PNG ou SVG, mínimo 256×256px</p>
                    </div>
                  </div>

                  <div className={styles.row2}>
                    <Field label="Nome da clínica">
                      <input name="nome" type="text" defaultValue={clinica.nome ?? ""} className={styles.input} />
                    </Field>
                    <Field label="CNPJ">
                      <input name="cnpj" type="text" defaultValue={clinica.cnpj ?? ""} className={styles.input} placeholder="00.000.000/0000-00" />
                    </Field>
                  </div>

                  <div className={styles.row2}>
                    <Field label="Telefone">
                      <input name="telefone" type="text" defaultValue={clinica.telefone ?? ""} className={styles.input} />
                    </Field>
                    <Field label="E-mail de contato">
                      <input name="email" type="email" defaultValue={clinica.email ?? ""} className={styles.input} />
                    </Field>
                  </div>

                  <Field label="Endereço">
                    <input name="endereco" type="text" defaultValue={clinica.endereco ?? ""} className={styles.input} />
                  </Field>

                  <div className={styles.formFooter}>
                    <button type="button" className={styles.btnSecondary}>Cancelar</button>
                    <button type="submit" disabled={enviando} className={styles.btnPrimary}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {enviando ? "Salvando..." : "Salvar alterações"}
                    </button>
                  </div>
                </form>
              </section>

              <section className={styles.card}>
                <h2 className={styles.cardTitle}>Preferências de agendamento</h2>

                <PrefRow titulo="Aprovação manual de agendamentos" sub="Solicitações do app precisam ser aprovadas" defaultChecked />
                <PrefRow titulo="Permitir agendamento online" sub="Pacientes podem solicitar horários pelo app" defaultChecked />
                <PrefRow titulo="Lembretes automáticos por WhatsApp" sub="Enviar 24h antes do atendimento (Pós-MVP)" />
              </section>
            </>
          )}

          {aba !== "perfil" && (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>{ABAS.find((a) => a.id === aba)?.label}</h2>
              <p className={styles.placeholderText}>
                Esta seção será disponibilizada em breve.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function PrefRow({ titulo, sub, defaultChecked }: { titulo: string; sub?: string; defaultChecked?: boolean }) {
  return (
    <div className={styles.prefRow}>
      <div>
        <span className={styles.prefTitle}>{titulo}</span>
        {sub && <span className={styles.prefSub}>{sub}</span>}
      </div>
      <label className={styles.toggleSwitch}>
        <input type="checkbox" defaultChecked={defaultChecked} />
        <span className={styles.toggleSlider} />
      </label>
    </div>
  );
}

function IconUser() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function IconClock() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function IconBell() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function IconUsers() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function IconPlug() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>; }
function IconShield() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function IconFile() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }