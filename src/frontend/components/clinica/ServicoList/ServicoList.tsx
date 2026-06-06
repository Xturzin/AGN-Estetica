"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Card, Input } from "@/frontend/components/ui";
import type { Servico } from "@/backend/services/servicoService";
import styles from "./ServicoList.module.css";

export const PALETA_CORES = [
  "#E0B7AC",
  "#7AA095",
  "#C49DBE",
  "#D9B26C",
  "#8AA4C8",
  "#D08A8A",
] as const;

export interface ServicoFormResult {
  error?: string;
  success?: string;
}

interface ServicoListProps {
  servicos: Servico[];
  categorias: string[];
  showInativos: boolean;
  createAction: (formData: FormData) => Promise<ServicoFormResult>;
  updateAction: (formData: FormData) => Promise<ServicoFormResult>;
  toggleAtivoAction: (formData: FormData) => Promise<ServicoFormResult>;
}

type ModalMode =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; servico: Servico };

function formatPreco(valor: number | string | null): string {
  if (valor === null || valor === undefined) return "—";
  const n = typeof valor === "number" ? valor : parseFloat(String(valor));
  if (isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDuracao(min: number | null): string {
  if (!min) return "—";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

export function ServicoList({
  servicos,
  categorias,
  showInativos,
  createAction,
  updateAction,
  toggleAtivoAction,
}: ServicoListProps) {
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

  function openEdit(servico: Servico) {
    setError(null);
    setModal({ type: "edit", servico });
  }

  function close() {
    setModal({ type: "closed" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (modal.type === "edit") {
      formData.append("id", modal.servico.id);
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

  async function handleToggle(servico: Servico) {
    const formData = new FormData();
    formData.append("id", servico.id);
    formData.append("ativo", servico.ativo ? "false" : "true");
    await toggleAtivoAction(formData);
  }

  const editing = modal.type === "edit" ? modal.servico : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link
          href={showInativos ? "/servicos" : "/servicos?inativos=1"}
          className={styles.toggleLink}
        >
          {showInativos ? "Esconder inativos" : "Mostrar inativos"}
        </Link>
        <Button onClick={openCreate}>+ Novo serviço</Button>
      </div>

      <Card>
        {servicos.length === 0 ? (
          <div className={styles.empty}>
            <p>Nenhum serviço cadastrado.</p>
            <Button onClick={openCreate} variant="ghost">
              Cadastrar primeiro serviço
            </Button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Duração</th>
                <th>Preço</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {servicos.map((s) => (
                <tr key={s.id} className={s.ativo ? "" : styles.rowInativo}>
                  <td>
                    <div className={styles.nomeCell}>
                      <span
                        className={styles.dot}
                        style={{ background: s.cor ?? "var(--ink-4)" }}
                      />
                      <span>{s.nome}</span>
                    </div>
                  </td>
                  <td>{s.categoria ?? "—"}</td>
                  <td>{formatDuracao(s.duracao_minutos)}</td>
                  <td>{formatPreco(s.preco)}</td>
                  <td className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() => openEdit(s)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() => handleToggle(s)}
                    >
                      {s.ativo ? "Desativar" : "Reativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <dialog ref={dialogRef} className={styles.dialog} onClose={close}>
        {modal.type !== "closed" && (
          <form onSubmit={handleSubmit} className={styles.dialogForm}>
            <header className={styles.dialogHeader}>
              <h2 className={styles.dialogTitle}>
                {modal.type === "edit" ? "Editar serviço" : "Novo serviço"}
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
              <Input label="Nome" name="nome" defaultValue={editing?.nome ?? ""} required />
              <Input
                label="Descrição"
                name="descricao"
                defaultValue={editing?.descricao ?? ""}
              />
              <div className={styles.row2}>
                <Input
                  label="Duração (min)"
                  name="duracao_minutos"
                  type="number"
                  min={5}
                  step={5}
                  defaultValue={String(editing?.duracao_minutos ?? 60)}
                />
                <Input
                  label="Preço (R$)"
                  name="preco"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={String(editing?.preco ?? 0)}
                />
              </div>
              <Input
                label="Categoria"
                name="categoria"
                defaultValue={editing?.categoria ?? ""}
                list="categorias-list"
                placeholder="Ex: Facial, Corporal, Capilar..."
              />
              <datalist id="categorias-list">
                {categorias.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>

              <div className={styles.coresField}>
                <label className={styles.coresLabel}>Cor</label>
                <div className={styles.coresGrid}>
                  {PALETA_CORES.map((cor, idx) => (
                    <label key={cor} className={styles.corOption}>
                      <input
                        type="radio"
                        name="cor"
                        value={cor}
                        defaultChecked={editing ? editing.cor === cor : idx === 0}
                      />
                      <span className={styles.corDot} style={{ background: cor }} />
                    </label>
                  ))}
                </div>
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