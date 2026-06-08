"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { ProfissionalRef, ServicoRef } from "@/backend/services/agendamentoService";
import styles from "./ClienteAgendarView.module.css";

interface ClienteAgendarViewProps {
  servicos: ServicoRef[];
  profissionais: ProfissionalRef[];
  solicitarAction: (formData: FormData) => Promise<{ error?: string; success?: string }>;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function getMinDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function ClienteAgendarView({ servicos, profissionais, solicitarAction }: ClienteAgendarViewProps) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    const fd = new FormData(e.currentTarget);
    const result = await solicitarAction(fd);
    setEnviando(false);
    if (result.error) {
      setErro(result.error);
    } else {
      setSucesso(true);
    }
  }

  if (sucesso) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.sucessoBox}>
          <div className={styles.sucessoIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className={styles.sucessoTitle}>Solicitação enviada</h2>
          <p className={styles.sucessoText}>
            A clínica vai analisar sua solicitação e você receberá uma resposta em breve.
          </p>
          <Link href="/cliente/home" className={styles.sucessoBtn}>
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  if (servicos.length === 0 || profissionais.length === 0) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Agendar</h1>
        </header>
        <div className={styles.empty}>
          A clínica ainda não cadastrou serviços ou profissionais.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Agendar</h1>
        <p className={styles.subtitle}>Preencha pra solicitar um horário. A clínica confirma.</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {erro && <div className={styles.erro}>{erro}</div>}

        <div className={styles.field}>
          <label className={styles.label}>Serviço</label>
          <select name="servico_id" required className={styles.input} defaultValue="">
            <option value="" disabled>Escolha...</option>
            {servicos.map((s) => (
              <option key={s.id} value={s.id}>{s.nome} ({s.duracao_minutos}min)</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Profissional</label>
          <select name="profissional_id" required className={styles.input} defaultValue="">
            <option value="" disabled>Escolha...</option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>{p.nome_completo}</option>
            ))}
          </select>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Data</label>
            <input type="date" name="data" required min={getMinDate()} className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Horário</label>
            <input type="time" name="hora" required className={styles.input} />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Observações (opcional)</label>
          <textarea name="observacoes" rows={3} className={styles.textarea} placeholder="Algo que a clínica precisa saber?" />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={enviando}>
          {enviando ? "Enviando..." : "Solicitar agendamento"}
        </button>
      </form>
    </div>
  );
}