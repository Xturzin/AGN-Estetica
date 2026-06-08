"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/frontend/components/ui";
import type {
  AgendamentoComRefs,
  PacienteRef,
  ProfissionalRef,
  ServicoRef,
  StatusAgendamento,
} from "@/backend/services/agendamentoService";
import styles from "./AgendaSemanal.module.css";

export interface AgendamentoFormResult {
  error?: string;
  success?: string;
}

interface AgendaSemanalProps {
  agendamentos: AgendamentoComRefs[];
  pacientes: PacienteRef[];
  profissionais: ProfissionalRef[];
  servicos: ServicoRef[];
  semanaInicio: string; // ISO date YYYY-MM-DD
  createAction: (formData: FormData) => Promise<AgendamentoFormResult>;
  updateAction: (formData: FormData) => Promise<AgendamentoFormResult>;
  cancelarAction: (formData: FormData) => Promise<AgendamentoFormResult>;
}

const HORA_INICIO = 7;
const HORA_FIM = 21;
const STATUS_LABELS: Record<StatusAgendamento, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  em_andamento: "Em atendimento",
  concluido: "Concluído",
  cancelado: "Cancelado",
  falta: "Falta",
};

const DIAS_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toLocalDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatHora(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatRangeSemana(inicio: Date): string {
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + 6);
  const fmt = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  return `${fmt(inicio)} – ${fmt(fim)}`;
}

export function AgendaSemanal({
  agendamentos,
  pacientes,
  profissionais,
  servicos,
  semanaInicio,
  createAction,
  updateAction,
  cancelarAction,
}: AgendaSemanalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const inicio = useMemo(() => new Date(`${semanaInicio}T00:00:00`), [semanaInicio]);

  const [filtroProfs, setFiltroProfs] = useState<Set<string>>(
    () => new Set(profissionais.map((p) => p.id))
  );
  const [showCancelados, setShowCancelados] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createDefaults, setCreateDefaults] = useState<{ dataHora: string } | null>(null);
  const [editTarget, setEditTarget] = useState<AgendamentoComRefs | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const createDialogRef = useRef<HTMLDialogElement>(null);
  const editDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = createDialogRef.current;
    if (!d) return;
    if (createOpen) {
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [createOpen]);

  useEffect(() => {
    const d = editDialogRef.current;
    if (!d) return;
    if (editTarget) {
      if (!d.open) d.showModal();
    } else if (d.open) {
      d.close();
    }
  }, [editTarget]);

  function navegarSemanas(delta: number) {
    const nova = new Date(inicio);
    nova.setDate(nova.getDate() + delta * 7);
    const iso = `${nova.getFullYear()}-${pad(nova.getMonth() + 1)}-${pad(nova.getDate())}`;
    startTransition(() => {
      router.push(`?semana=${iso}`);
    });
  }

  function irParaHoje() {
    const hoje = new Date();
    const day = hoje.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    hoje.setDate(hoje.getDate() + diff);
    const iso = `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-${pad(hoje.getDate())}`;
    startTransition(() => {
      router.push(`?semana=${iso}`);
    });
  }

  function toggleProf(id: string) {
    const novo = new Set(filtroProfs);
    if (novo.has(id)) novo.delete(id);
    else novo.add(id);
    setFiltroProfs(novo);
  }

  function abrirCreateEmSlot(diaIdx: number, hora: number, minutos: number) {
    const data = new Date(inicio);
    data.setDate(data.getDate() + diaIdx);
    data.setHours(hora, minutos, 0, 0);
    const dataHora = `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}T${pad(hora)}:${pad(minutos)}`;
    setCreateDefaults({ dataHora });
    setFormError(null);
    setCreateOpen(true);
  }

  function abrirCreateGenerico() {
    const agora = new Date();
    agora.setMinutes(0, 0, 0);
    if (agora.getHours() < HORA_INICIO) agora.setHours(HORA_INICIO);
    setCreateDefaults({ dataHora: toLocalDateTime(agora.toISOString()) });
    setFormError(null);
    setCreateOpen(true);
  }

  function abrirEdit(a: AgendamentoComRefs) {
    setEditTarget(a);
    setFormError(null);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createAction(formData);
    setSaving(false);
    if (result.error) {
      setFormError(result.error);
    } else {
      setCreateOpen(false);
    }
  }

  async function handleEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("id", editTarget.id);
    const result = await updateAction(formData);
    setSaving(false);
    if (result.error) {
      setFormError(result.error);
    } else {
      setEditTarget(null);
    }
  }

  async function handleCancelar() {
    if (!editTarget) return;
    if (!confirm("Cancelar este agendamento?")) return;
    setSaving(true);
    const formData = new FormData();
    formData.set("id", editTarget.id);
    const result = await cancelarAction(formData);
    setSaving(false);
    if (result.error) {
      setFormError(result.error);
    } else {
      setEditTarget(null);
    }
  }

  const agendamentosFiltrados = agendamentos.filter((a) => {
    if (!a.profissional || !filtroProfs.has(a.profissional.id)) return false;
    if (!showCancelados && a.status === "cancelado") return false;
    return true;
  });

  const horas: number[] = [];
  for (let h = HORA_INICIO; h < HORA_FIM; h++) horas.push(h);

  const diasDaSemana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicio);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.navGroup}>
          <button type="button" className={styles.navBtn} onClick={() => navegarSemanas(-1)} disabled={isPending}>‹</button>
          <span className={styles.semanaLabel}>{formatRangeSemana(inicio)}</span>
          <button type="button" className={styles.navBtn} onClick={() => navegarSemanas(1)} disabled={isPending}>›</button>
          <Button variant="ghost" onClick={irParaHoje}>Hoje</Button>
        </div>
        <Button onClick={abrirCreateGenerico}>+ Novo agendamento</Button>
      </div>

      <div className={styles.filtros}>
        <span className={styles.filtroLabel}>Profissionais:</span>
        {profissionais.map((p) => (
          <label key={p.id} className={styles.profChip}>
            <input
              type="checkbox"
              checked={filtroProfs.has(p.id)}
              onChange={() => toggleProf(p.id)}
            />
            <span className={styles.profDot} style={{ background: p.cor_agenda ?? "#888" }} />
            <span>{p.nome_completo.split(" ")[0]}</span>
          </label>
        ))}
        <label className={styles.toggleCancelados}>
          <input
            type="checkbox"
            checked={showCancelados}
            onChange={(e) => setShowCancelados(e.target.checked)}
          />
          <span>Mostrar cancelados</span>
        </label>
      </div>

      <Card>
        <div className={styles.grid}>
          <div className={styles.headerRow}>
            <div className={styles.horaHeader} />
            {diasDaSemana.map((d, i) => {
              const hoje = new Date();
              const isHoje =
                d.getFullYear() === hoje.getFullYear() &&
                d.getMonth() === hoje.getMonth() &&
                d.getDate() === hoje.getDate();
              return (
                <div key={i} className={`${styles.diaHeader} ${isHoje ? styles.diaHoje : ""}`}>
                  <span className={styles.diaSemana}>{DIAS_LABELS[i]}</span>
                  <span className={styles.diaNum}>{pad(d.getDate())}/{pad(d.getMonth() + 1)}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.body}>
            <div className={styles.horasCol}>
              {horas.map((h) => (
                <div key={h} className={styles.horaCell}>{pad(h)}:00</div>
              ))}
            </div>

            {diasDaSemana.map((d, diaIdx) => (
              <div key={diaIdx} className={styles.diaCol}>
                {horas.map((h) => (
                  <button
                    key={`${diaIdx}-${h}-0`}
                    type="button"
                    className={`${styles.slot} ${styles.slotTop}`}
                    onClick={() => abrirCreateEmSlot(diaIdx, h, 0)}
                    aria-label={`Criar agendamento ${DIAS_LABELS[diaIdx]} ${pad(h)}:00`}
                  />
                ))}
                {horas.map((h) => (
                  <button
                    key={`${diaIdx}-${h}-30`}
                    type="button"
                    className={`${styles.slot} ${styles.slotBottom}`}
                    onClick={() => abrirCreateEmSlot(diaIdx, h, 30)}
                    aria-label={`Criar agendamento ${DIAS_LABELS[diaIdx]} ${pad(h)}:30`}
                  />
                ))}

                {agendamentosFiltrados
                  .filter((a) => {
                    const ai = new Date(a.data_hora_inicio);
                    return (
                      ai.getFullYear() === d.getFullYear() &&
                      ai.getMonth() === d.getMonth() &&
                      ai.getDate() === d.getDate()
                    );
                  })
                  .map((a) => {
                    const ai = new Date(a.data_hora_inicio);
                    const af = new Date(a.data_hora_fim);
                    const startMin = (ai.getHours() - HORA_INICIO) * 60 + ai.getMinutes();
                    const durMin = (af.getTime() - ai.getTime()) / 60_000;
                    const cor = a.profissional?.cor_agenda ?? "#888";
                    const cardStyle = {
                      top: `calc(var(--row-h) * ${startMin / 60})`,
                      height: `calc(var(--row-h) * ${durMin / 60})`,
                      background: `${cor}33`,
                      borderLeftColor: cor,
                    };
                    const className = [
                      styles.cardAgendamento,
                      a.status === "concluido" ? styles.cardConcluido : "",
                      a.status === "cancelado" ? styles.cardCancelado : "",
                      a.status === "falta" ? styles.cardFalta : "",
                    ].join(" ");
                    return (
                      <button
                        key={a.id}
                        type="button"
                        className={className}
                        style={cardStyle}
                        onClick={() => abrirEdit(a)}
                      >
                        <span className={styles.cardHora}>{formatHora(a.data_hora_inicio)}</span>
                        <span className={styles.cardPaciente}>{a.paciente?.nome_completo ?? "—"}</span>
                        <span className={styles.cardServico}>{a.servico?.nome ?? ""}</span>
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <dialog ref={createDialogRef} className={styles.dialog} onClose={() => setCreateOpen(false)}>
        {createOpen && (
          <AgendamentoForm
            kind="create"
            defaults={createDefaults}
            target={null}
            pacientes={pacientes}
            profissionais={profissionais}
            servicos={servicos}
            onSubmit={handleCreate}
            onClose={() => setCreateOpen(false)}
            saving={saving}
            error={formError}
          />
        )}
      </dialog>

      <dialog ref={editDialogRef} className={styles.dialog} onClose={() => setEditTarget(null)}>
        {editTarget && (
          <AgendamentoForm
            kind="edit"
            defaults={null}
            target={editTarget}
            pacientes={pacientes}
            profissionais={profissionais}
            servicos={servicos}
            onSubmit={handleEdit}
            onClose={() => setEditTarget(null)}
            onCancelar={handleCancelar}
            saving={saving}
            error={formError}
          />
        )}
      </dialog>
    </div>
  );
}

interface AgendamentoFormProps {
  kind: "create" | "edit";
  defaults: { dataHora: string } | null;
  target: AgendamentoComRefs | null;
  pacientes: PacienteRef[];
  profissionais: ProfissionalRef[];
  servicos: ServicoRef[];
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onCancelar?: () => void;
  saving: boolean;
  error: string | null;
}

function AgendamentoForm({
  kind,
  defaults,
  target,
  pacientes,
  profissionais,
  servicos,
  onSubmit,
  onClose,
  onCancelar,
  saving,
  error,
}: AgendamentoFormProps) {
  const initialServicoId = target?.servico_id ?? servicos[0]?.id ?? "";
  const initialDuracao =
    target?.servico?.duracao_minutos ??
    servicos.find((s) => s.id === initialServicoId)?.duracao_minutos ??
    30;

  const [servicoId, setServicoId] = useState<string>(initialServicoId);
  const [duracao, setDuracao] = useState<number>(initialDuracao);

  function onChangeServico(e: React.ChangeEvent<HTMLSelectElement>) {
    const novoId = e.target.value;
    setServicoId(novoId);
    const s = servicos.find((sv) => sv.id === novoId);
    if (s) setDuracao(s.duracao_minutos);
  }

  const dataHoraDefault = target
    ? toLocalDateTime(target.data_hora_inicio)
    : defaults?.dataHora ?? "";

  return (
    <form onSubmit={onSubmit} className={styles.dialogForm}>
      <header className={styles.dialogHeader}>
        <h2 className={styles.dialogTitle}>
          {kind === "create" ? "Novo agendamento" : "Editar agendamento"}
        </h2>
        <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Fechar">×</button>
      </header>

      {error && <div className={styles.feedbackError}>{error}</div>}

      <div className={styles.dialogBody}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Paciente</label>
          <select name="paciente_id" required className={styles.input} defaultValue={target?.paciente_id ?? ""}>
            <option value="">Selecione...</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>{p.nome_completo}</option>
            ))}
          </select>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Profissional</label>
            <select name="profissional_id" required className={styles.input} defaultValue={target?.profissional_id ?? ""}>
              <option value="">Selecione...</option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.id}>{p.nome_completo}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Serviço</label>
            <select
              name="servico_id"
              required
              className={styles.input}
              value={servicoId}
              onChange={onChangeServico}
            >
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>{s.nome} ({s.duracao_minutos}min)</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Início</label>
            <input
              type="datetime-local"
              name="data_hora_inicio"
              required
              className={styles.input}
              defaultValue={dataHoraDefault}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Duração (min)</label>
            <input
              type="number"
              name="duracao_minutos"
              min={5}
              max={480}
              step={5}
              required
              className={styles.input}
              value={duracao}
              onChange={(e) => setDuracao(parseInt(e.target.value, 10) || 30)}
            />
          </div>
        </div>

        {kind === "edit" && target && (
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Status</label>
            <select name="status" className={styles.input} defaultValue={target.status}>
              {(Object.keys(STATUS_LABELS) as StatusAgendamento[]).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Observações</label>
          <textarea
            name="observacoes"
            rows={2}
            className={styles.textarea}
            defaultValue={target?.observacoes ?? ""}
          />
        </div>
      </div>

      <footer className={styles.dialogFooter}>
        {kind === "edit" && onCancelar && (
          <Button type="button" variant="ghost" onClick={onCancelar} disabled={saving}>
            Cancelar agendamento
          </Button>
        )}
        <div className={styles.footerSpacer} />
        <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>Fechar</Button>
        <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
      </footer>
    </form>
  );
}