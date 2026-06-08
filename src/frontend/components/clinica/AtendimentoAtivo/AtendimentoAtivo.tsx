"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Card } from "@/frontend/components/ui";
import type { AtendimentoComRefs } from "@/backend/services/atendimentoService";
import type { EvolucaoComAutor, TipoEvolucao } from "@/backend/services/evolucaoService";
import type { FotoComUrl } from "@/backend/services/fotoClinicaService";
import { FotoGallery, type FotoUploadResult } from "@/frontend/components/clinica/FotoGallery";
import type { EvolucaoFormResult } from "@/frontend/components/clinica/EvolucaoTimeline";
import styles from "./AtendimentoAtivo.module.css";

interface AtendimentoAtivoProps {
  atendimento: AtendimentoComRefs;
  evolucoes: EvolucaoComAutor[];
  fotos: FotoComUrl[];
  createEvolucaoAction: (formData: FormData) => Promise<EvolucaoFormResult>;
  uploadFotoAction: (formData: FormData) => Promise<FotoUploadResult>;
  finalizarAction: (formData: FormData) => Promise<{ error?: string; success?: string }>;
  cancelarAction: (formData: FormData) => Promise<{ error?: string; success?: string }>;
}

const TIPOS_EVOLUCAO: { value: TipoEvolucao; label: string }[] = [
  { value: "procedimento", label: "Procedimento" },
  { value: "observacao", label: "Observação" },
  { value: "avaliacao", label: "Avaliação" },
  { value: "consulta", label: "Consulta" },
  { value: "retorno", label: "Retorno" },
  { value: "exame", label: "Exame" },
];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatElapsed(start: Date, now: Date): string {
  const diff = Math.max(0, now.getTime() - start.getTime());
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function AtendimentoAtivo({
  atendimento,
  evolucoes,
  fotos,
  createEvolucaoAction,
  uploadFotoAction,
  finalizarAction,
  cancelarAction,
}: AtendimentoAtivoProps) {
  const inicio = new Date(atendimento.data_hora_inicio);
  const [now, setNow] = useState(new Date());
  const [obs, setObs] = useState("");
  const [evoTitulo, setEvoTitulo] = useState("");
  const [evoDesc, setEvoDesc] = useState("");
  const [evoTipo, setEvoTipo] = useState<TipoEvolucao>("procedimento");
  const [evoError, setEvoError] = useState<string | null>(null);
  const [evoSaving, setEvoSaving] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [finalError, setFinalError] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isAtivo = atendimento.status === "em_andamento";

  async function handleAddEvolucao(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!evoTitulo.trim()) return;
    setEvoSaving(true);
    setEvoError(null);
    const fd = new FormData();
    fd.set("titulo", evoTitulo.trim());
    fd.set("descricao", evoDesc.trim());
    fd.set("tipo", evoTipo);
    fd.set("data_hora", new Date().toISOString());
    fd.set("atendimento_id", atendimento.id);
    const result = await createEvolucaoAction(fd);
    setEvoSaving(false);
    if (result.error) {
      setEvoError(result.error);
    } else {
      setEvoTitulo("");
      setEvoDesc("");
    }
  }

  async function handleFinalizar() {
    if (!confirm("Finalizar atendimento agora?")) return;
    setFinalizando(true);
    setFinalError(null);
    const fd = new FormData();
    fd.set("observacoes", obs.trim());
    const result = await finalizarAction(fd);
    setFinalizando(false);
    if (result.error) setFinalError(result.error);
  }

  async function handleCancelar() {
    if (!confirm("Cancelar este atendimento?")) return;
    const result = await cancelarAction(new FormData());
    if (result.error) setFinalError(result.error);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <Link href={`/pacientes/${atendimento.paciente_id}`} className={styles.backLink}>
            ← Voltar ao perfil
          </Link>
          <h1 className={styles.title}>{atendimento.paciente?.nome_completo ?? "—"}</h1>
          <p className={styles.subtitle}>
            {atendimento.servico?.nome ?? "—"} · com {atendimento.profissional?.nome_completo ?? "—"}
          </p>
        </div>
        <div className={styles.timerBox}>
          <span className={styles.timerLabel}>{isAtivo ? "Em atendimento" : "Atendimento"}</span>
          <span className={`${styles.timer} ${!isAtivo ? styles.timerStopped : ""}`}>
            {isAtivo
              ? formatElapsed(inicio, now)
              : atendimento.duracao_minutos
                ? `${atendimento.duracao_minutos} min`
                : "—"}
          </span>
        </div>
      </div>

      {!isAtivo && (
        <Card>
          <div className={styles.statusBanner}>
            Este atendimento está <strong>{atendimento.status}</strong>. Edição bloqueada.
          </div>
        </Card>
      )}

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Adicionar evolução</h2>
          {evoError && <div className={styles.errorBox}>{evoError}</div>}
          <form onSubmit={handleAddEvolucao} className={styles.evoForm}>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Título</label>
                <input
                  type="text"
                  className={styles.input}
                  value={evoTitulo}
                  onChange={(e) => setEvoTitulo(e.target.value)}
                  required
                  disabled={!isAtivo}
                  placeholder="Ex: Aplicação de toxina"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Tipo</label>
                <select
                  className={styles.input}
                  value={evoTipo}
                  onChange={(e) => setEvoTipo(e.target.value as TipoEvolucao)}
                  disabled={!isAtivo}
                >
                  {TIPOS_EVOLUCAO.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Descrição (opcional)</label>
              <textarea
                className={styles.textarea}
                rows={2}
                value={evoDesc}
                onChange={(e) => setEvoDesc(e.target.value)}
                disabled={!isAtivo}
              />
            </div>
            <div className={styles.evoFormFooter}>
              <Button type="submit" disabled={!isAtivo || evoSaving}>
                {evoSaving ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </form>

          {evolucoes.length > 0 && (
            <div className={styles.evoLista}>
              <h3 className={styles.subTitle}>Registradas neste atendimento</h3>
              {evolucoes.map((e) => (
                <div key={e.id} className={styles.evoItem}>
                  <span className={styles.evoTipo}>{e.tipo}</span>
                  <span className={styles.evoTitulo}>{e.titulo}</span>
                  {e.descricao && <span className={styles.evoDesc}>{e.descricao}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Fotos durante o atendimento</h2>
          <FotoGallery fotos={fotos} canEdit={isAtivo} uploadAction={uploadFotoAction} />
        </div>
      </Card>

      {isAtivo && (
        <Card>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Finalizar</h2>
            {finalError && <div className={styles.errorBox}>{finalError}</div>}
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Observações finais (opcional)</label>
              <textarea
                className={styles.textarea}
                rows={3}
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Resumo do que aconteceu, próximos passos, etc."
              />
            </div>
            <div className={styles.finalActions}>
              <Button type="button" variant="ghost" onClick={handleCancelar} disabled={finalizando}>
                Cancelar atendimento
              </Button>
              <div className={styles.spacer} />
              <Button type="button" onClick={handleFinalizar} disabled={finalizando}>
                {finalizando ? "Finalizando..." : "Finalizar atendimento"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}