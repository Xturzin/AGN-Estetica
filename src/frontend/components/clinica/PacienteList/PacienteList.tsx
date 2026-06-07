"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Card, Input } from "@/frontend/components/ui";
import { useCEP } from "@/frontend/hooks/useCEP";
import type { Paciente } from "@/backend/services/pacienteService";
import styles from "./PacienteList.module.css";

export interface PacienteFormResult {
  error?: string;
  success?: string;
}

interface PacienteListProps {
  pacientes: Paciente[];
  showInativos: boolean;
  createAction: (formData: FormData) => Promise<PacienteFormResult>;
  updateAction: (formData: FormData) => Promise<PacienteFormResult>;
  toggleAtivoAction: (formData: FormData) => Promise<PacienteFormResult>;
}

type ModalMode =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; paciente: Paciente };

function calcAge(birth: string | null): string {
  if (!birth) return "—";
  const b = new Date(birth);
  if (isNaN(b.getTime())) return "—";
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return `${age} anos`;
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function PacienteList({
  pacientes,
  showInativos,
  createAction,
  updateAction,
  toggleAtivoAction,
}: PacienteListProps) {
  const [modal, setModal] = useState<ModalMode>({ type: "closed" });
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { data: cepData, error: cepError, loading: cepLoading, lookup, reset: resetCep } = useCEP();

  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (modal.type === "closed") {
      if (d.open) d.close();
    } else {
      if (!d.open) d.showModal();
    }
  }, [modal]);

  useEffect(() => {
    if (modal.type === "edit") {
      const p = modal.paciente;
      setCep(p.cep ?? "");
      setLogradouro(p.logradouro ?? "");
      setBairro(p.bairro ?? "");
      setCidade(p.cidade ?? "");
      setEstado(p.estado ?? "");
    } else if (modal.type === "create") {
      setCep("");
      setLogradouro("");
      setBairro("");
      setCidade("");
      setEstado("");
    }
    resetCep();
  }, [modal, resetCep]);

  useEffect(() => {
    if (cepData) {
      setLogradouro(cepData.logradouro);
      setBairro(cepData.bairro);
      setCidade(cepData.cidade);
      setEstado(cepData.estado);
    }
  }, [cepData]);

  function openCreate() {
    setError(null);
    setModal({ type: "create" });
  }

  function openEdit(paciente: Paciente) {
    setError(null);
    setModal({ type: "edit", paciente });
  }

  function close() {
    setModal({ type: "closed" });
  }

  function handleCepBlur() {
    const clean = cep.replace(/\D/g, "");
    if (clean.length === 8) void lookup(clean);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (modal.type === "edit") {
      formData.append("id", modal.paciente.id);
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

  async function handleToggle(paciente: Paciente) {
    const formData = new FormData();
    formData.append("id", paciente.id);
    formData.append("ativo", paciente.ativo ? "false" : "true");
    await toggleAtivoAction(formData);
  }

  const editing = modal.type === "edit" ? modal.paciente : null;

  const filtered = useMemo(() => {
    if (!search.trim()) return pacientes;
    const q = normalize(search);
    return pacientes.filter(
      (p) =>
        normalize(p.nome_completo).includes(q) ||
        (p.cpf && p.cpf.includes(q)) ||
        (p.telefone && p.telefone.includes(q))
    );
  }, [pacientes, search]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <input
          type="search"
          placeholder="Buscar por nome, CPF, telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
        <div className={styles.headerActions}>
          <Link
            href={showInativos ? "/pacientes" : "/pacientes?inativos=1"}
            className={styles.toggleLink}
          >
            {showInativos ? "Esconder inativos" : "Mostrar inativos"}
          </Link>
          <Button onClick={openCreate}>+ Novo paciente</Button>
        </div>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            {search.trim() ? (
              <p>Nenhum paciente encontrado para “{search}”.</p>
            ) : (
              <>
                <p>Nenhum paciente cadastrado.</p>
                <Button onClick={openCreate} variant="ghost">
                  Cadastrar primeiro paciente
                </Button>
              </>
            )}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th>Telefone</th>
                <th>E-mail</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={p.ativo ? "" : styles.rowInativo}>
                  <td>
                    <Link href={`/pacientes/${p.id}`} className={styles.nameLink}>
                      {p.nome_completo}
                    </Link>
                  </td>
                  <td>{calcAge(p.data_nascimento)}</td>
                  <td className={styles.muted}>{p.telefone ?? "—"}</td>
                  <td className={styles.muted}>{p.email ?? "—"}</td>
                  <td className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() => openEdit(p)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() => handleToggle(p)}
                    >
                      {p.ativo ? "Desativar" : "Reativar"}
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
                {modal.type === "edit" ? "Editar paciente" : "Novo paciente"}
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
              <div className={styles.row2}>
                <Input
                  label="Data de nascimento"
                  name="data_nascimento"
                  type="date"
                  defaultValue={editing?.data_nascimento ?? ""}
                />
                <Input
                  label="CPF"
                  name="cpf"
                  defaultValue={editing?.cpf ?? ""}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className={styles.row2}>
                <Input
                  label="Telefone"
                  name="telefone"
                  defaultValue={editing?.telefone ?? ""}
                  icon="phone"
                  placeholder="(00) 00000-0000"
                />
                <Input
                  label="E-mail"
                  name="email"
                  type="email"
                  defaultValue={editing?.email ?? ""}
                  icon="mail"
                />
              </div>

              <div className={styles.divider}>Endereço</div>

              <div className={styles.rowCep}>
                <div className={styles.cepInputWrap}>
                  <Input
                    label="CEP"
                    name="cep"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    onBlur={handleCepBlur}
                    placeholder="00000-000"
                  />
                </div>
                {cepLoading && <span className={styles.cepHelp}>Buscando...</span>}
                {cepError && <span className={styles.cepError}>{cepError}</span>}
              </div>

              <Input
                label="Logradouro"
                name="logradouro"
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
              />
              <div className={styles.row2}>
                <Input
                  label="Bairro"
                  name="bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
                <Input
                  label="Cidade"
                  name="cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <Input
                label="UF"
                name="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value.toUpperCase())}
                maxLength={2}
                placeholder="SP"
              />
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