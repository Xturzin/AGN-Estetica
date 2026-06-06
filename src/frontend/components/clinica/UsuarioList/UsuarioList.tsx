"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Card, Input } from "@/frontend/components/ui";
import { PALETA_CORES } from "@/frontend/components/clinica/ServicoList";
import type { Usuario, TipoUsuario } from "@/backend/services/usuarioService";
import styles from "./UsuarioList.module.css";

export interface UsuarioFormResult {
  error?: string;
  success?: string;
}

interface UsuarioListProps {
  usuarios: Usuario[];
  showInativos: boolean;
  inviteAction: (formData: FormData) => Promise<UsuarioFormResult>;
  updateAction: (formData: FormData) => Promise<UsuarioFormResult>;
  toggleAtivoAction: (formData: FormData) => Promise<UsuarioFormResult>;
}

type ModalMode =
  | { type: "closed" }
  | { type: "invite" }
  | { type: "edit"; usuario: Usuario };

function tipoLabel(tipo: TipoUsuario): string {
  switch (tipo) {
    case "admin":
      return "Admin";
    case "profissional":
      return "Profissional";
    case "recepcionista":
      return "Recepcionista";
    case "cliente":
      return "Cliente";
  }
}

function tipoColor(tipo: TipoUsuario): string {
  switch (tipo) {
    case "admin":
      return "var(--ink)";
    case "profissional":
      return "var(--accent-deep)";
    case "recepcionista":
      return "#7AA095";
    case "cliente":
      return "var(--ink-3)";
  }
}

export function UsuarioList({
  usuarios,
  showInativos,
  inviteAction,
  updateAction,
  toggleAtivoAction,
}: UsuarioListProps) {
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

  function openInvite() {
    setError(null);
    setModal({ type: "invite" });
  }

  function openEdit(usuario: Usuario) {
    setError(null);
    setModal({ type: "edit", usuario });
  }

  function close() {
    setModal({ type: "closed" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (modal.type === "edit") {
      formData.append("id", modal.usuario.id);
    }
    const action = modal.type === "edit" ? updateAction : inviteAction;
    const result = await action(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setError(null);
      close();
    }
  }

  async function handleToggle(usuario: Usuario) {
    const formData = new FormData();
    formData.append("id", usuario.id);
    formData.append("ativo", usuario.ativo ? "false" : "true");
    await toggleAtivoAction(formData);
  }

  const editing = modal.type === "edit" ? modal.usuario : null;
  const isInvite = modal.type === "invite";

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link
          href={showInativos ? "/usuarios" : "/usuarios?inativos=1"}
          className={styles.toggleLink}
        >
          {showInativos ? "Esconder inativos" : "Mostrar inativos"}
        </Link>
        <Button onClick={openInvite}>+ Convidar membro</Button>
      </div>

      <Card>
        {usuarios.length === 0 ? (
          <div className={styles.empty}>
            <p>Nenhum membro da equipe.</p>
            <Button onClick={openInvite} variant="ghost">
              Convidar primeiro membro
            </Button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Usuário</th>
                <th>E-mail</th>
                <th>Tipo</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className={u.ativo ? "" : styles.rowInativo}>
                  <td>
                    <div className={styles.nomeCell}>
                      <span
                        className={styles.dot}
                        style={{ background: u.cor_agenda ?? "var(--ink-4)" }}
                      />
                      <span>{u.nome_completo}</span>
                    </div>
                  </td>
                  <td className={styles.usernameCell}>@{u.username}</td>
                  <td className={styles.emailCell}>{u.email}</td>
                  <td>
                    <span className={styles.badge} style={{ color: tipoColor(u.tipo) }}>
                      {tipoLabel(u.tipo)}
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    {u.tipo === "admin" ? (
                      <span className={styles.blockedLabel}>—</span>
                    ) : (
                      <>
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => openEdit(u)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => handleToggle(u)}
                        >
                          {u.ativo ? "Desativar" : "Reativar"}
                        </button>
                      </>
                    )}
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
                {isInvite ? "Convidar membro" : "Editar membro"}
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
              <Input
                label="Nome completo"
                name="nome_completo"
                defaultValue={editing?.nome_completo ?? ""}
                required
              />
              <Input
                label="Username"
                name="username"
                defaultValue={editing?.username ?? ""}
                required
                placeholder="ex: maria.silva"
              />
              {isInvite && (
                <Input
                  label="E-mail"
                  name="email"
                  type="email"
                  required
                  placeholder="email@exemplo.com"
                  icon="mail"
                />
              )}

              <div className={styles.tipoField}>
                <label className={styles.fieldLabel}>Tipo</label>
                <div className={styles.tipoOptions}>
                  <label className={styles.tipoOption}>
                    <input
                      type="radio"
                      name="tipo"
                      value="profissional"
                      defaultChecked={editing ? editing.tipo === "profissional" : true}
                    />
                    <span>Profissional</span>
                  </label>
                  <label className={styles.tipoOption}>
                    <input
                      type="radio"
                      name="tipo"
                      value="recepcionista"
                      defaultChecked={editing?.tipo === "recepcionista"}
                    />
                    <span>Recepcionista</span>
                  </label>
                </div>
              </div>

              <div className={styles.coresField}>
                <label className={styles.fieldLabel}>Cor na agenda</label>
                <div className={styles.coresGrid}>
                  {PALETA_CORES.map((cor, idx) => (
                    <label key={cor} className={styles.corOption}>
                      <input
                        type="radio"
                        name="cor_agenda"
                        value={cor}
                        defaultChecked={editing ? editing.cor_agenda === cor : idx === 0}
                      />
                      <span className={styles.corDot} style={{ background: cor }} />
                    </label>
                  ))}
                </div>
              </div>

              {isInvite && (
                <p className={styles.inviteHint}>
                  Um e-mail de convite será enviado para definir a senha.
                </p>
              )}
            </div>

            <footer className={styles.dialogFooter}>
              <Button type="button" variant="ghost" onClick={close}>
                Cancelar
              </Button>
              <Button type="submit">{isInvite ? "Enviar convite" : "Salvar"}</Button>
            </footer>
          </form>
        )}
      </dialog>
    </div>
  );
}