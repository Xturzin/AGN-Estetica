"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, Card } from "@/frontend/components/ui";
import type {
  EvolucaoComAutor,
  TipoEvolucao,
} from "@/backend/services/evolucaoService";
import styles from "./EvolucaoTimeline.module.css";

export interface EvolucaoFormResult {
  error?: string;
  success?: string;
}

interface EvolucaoTimelineProps {
  evolucoes: EvolucaoComAutor[];
  canEdit: boolean;
  createAction: (formData: FormData) => Promise<EvolucaoFormResult>;
  updateAction: (formData: FormData) => Promise<EvolucaoFormResult>;
}

type ModalMode =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; evolucao: EvolucaoComAutor };

const TIPO_LABELS: Record<TipoEvolucao, string> = {
  consulta: "Consulta",
  avaliacao: "Avaliação",
  procedimento: "Procedimento",
  observacao: "Observação",
  retorno: "Retorno",
  exame: "Exame",
};

const TIPO_COLORS: Record<TipoEvolucao, string> = {
  consulta: "#E0B7AC",
  avaliacao: "#D08A8A",
  procedimento: "#7AA095",
  observacao: "#8AA4C8",
  retorno: "#C49DBE",
  exame: "#D9B26C",
};

const TIPOS: TipoEvolucao[] = [
  "consulta",
  "avaliacao",
  "procedimento",
  "observacao",
  "retorno",
  "exame",
];

function formatDateTime(dt: string): string {
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function nowLocalDateTime(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toLocalDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EvolucaoTimeline({
  evolucoes,
  canEdit,
  createAction,
  updateAction,
}: EvolucaoTimelineProps) {
  const [modal, setModal] = useState<ModalMode>({ type: "closed" });
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (modal.type === "closed") {
      if (d.open) d.close();
    } else {
      if (!d.open) d.showModal();
    }
  }, [modal]);

  function openCreate() {
    setError(null);
    setModal({ type: "create" });
  }

  function openEdit(evolucao: EvolucaoComAutor) {
    setError(null);
    setModal({ type: "edit", evolucao });
  }

  function close() {
    setModal({ type: "closed" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (modal.type === "edit") {
      formData.append("id", modal.evolucao.id);
    }
    const action = modal.type === "edit" ? updateAction : createAction;
    const result = await action(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      close();
    }
  }

  const editing = modal.type === "edit" ? modal.evolucao : null;

  return (
    <div className={styles.wrapper}>
      {canEdit && (
        <div className={styles.header}>
          <Button onClick={openCreate}>+ Nova evolução</Button>
        </div>
      )}

      {evolucoes.length === 0 ? (
        <Card>
          <div className={styles.empty}>
            <p>Nenhuma evolução registrada ainda.</p>
            {canEdit && (
              <Button onClick={openCreate} variant="ghost">
                Registrar primeira evolução
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <ol className={styles.timeline}>
          {evolucoes.map((e) => (
            <li key={e.id} className={styles.item}>
              <span
                className={styles.dot}
                style={{ background: TIPO_COLORS[e.tipo] }}
              />
              <Card>
                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderLeft}>
                      <span
                        className={styles.badge}
                        style={{ background: TIPO_COLORS[e.tipo] }}
                      >
                        {TIPO_LABELS[e.tipo]}
                      </span>
                      <h3 className={styles.cardTitle}>{e.titulo}</h3>
                    </div>
                    {canEdit && (
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => openEdit(e)}
                      >
                        Editar
                      </button>
                    )}
                  </div>
                  <div className={styles.cardMeta}>
                    <span>{formatDateTime(e.data_hora)}</span>
                    {e.profissional && (
                      <>
                        <span className={styles.metaDot}>·</span>
                        <span>{e.profissional.nome_completo}</span>
                      </>
                    )}
                  </div>
                  {e.descricao && (
                    <p className={styles.description}>{e.descricao}</p>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ol>
      )}

      <dialog ref={dialogRef} className={styles.dialog} onClose={close}>
        {modal.type !== "closed" && (
          <form onSubmit={handleSubmit} className={styles.dialogForm}>
            <header className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>
                {modal.type === "edit" ? "Editar evolução" : "Nova evolução"}
              </h2>
              <button
                type="button"
                onClick={close}
                className={styles.closeBtn}
                aria-label="Fechar"
              >
                ×
              </button>
            </header>

            {error && <div className={styles.feedbackError}>{error}</div>}

            <div className={styles.dialogBody}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Tipo</label>
                <div className={styles.tipoGrid}>
                  {TIPOS.map((t, idx) => (
                    <label key={t} className={styles.tipoOption}>
                      <input
                        type="radio"
                        name="tipo"
                        value={t}
                        defaultChecked={
                          editing ? editing.tipo === t : idx === 0
                        }
                      />
                      <span
                        className={styles.tipoDot}
                        style={{ background: TIPO_COLORS[t] }}
                      />
                      <span>{TIPO_LABELS[t]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Título</label>
                <input
                  type="text"
                  name="titulo"
                  required
                  defaultValue={editing?.titulo ?? ""}
                  className={styles.input}
                  placeholder="Ex: Primeira sessão de limpeza"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Data e hora</label>
                <input
                  type="datetime-local"
                  name="data_hora"
                  required
                  defaultValue={
                    editing?.data_hora
                      ? toLocalDateTime(editing.data_hora)
                      : nowLocalDateTime()
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Descrição</label>
                <textarea
                  name="descricao"
                  defaultValue={editing?.descricao ?? ""}
                  rows={5}
                  className={styles.textarea}
                  placeholder="Detalhes do procedimento, observações, conduta..."
                />
              </div>
            </div>

            <footer className={styles.dialogFooter}>
              <Button type="button" variant="ghost" onClick={close}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </footer>
          </form>
        )}
      </dialog>
    </div>
  );
}