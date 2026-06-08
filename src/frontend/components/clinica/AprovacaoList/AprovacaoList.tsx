"use client";

import { useState } from "react";
import { Button, Card } from "@/frontend/components/ui";
import type { AprovacaoComSolicitante } from "@/backend/services/aprovacaoService";
import styles from "./AprovacaoList.module.css";

export interface AprovacaoActionResult {
  error?: string;
  success?: string;
}

interface AprovacaoListProps {
  aprovacoes: AprovacaoComSolicitante[];
  aprovarAction: (formData: FormData) => Promise<AprovacaoActionResult>;
  recusarAction: (formData: FormData) => Promise<AprovacaoActionResult>;
}

const TIPO_LABELS: Record<string, string> = {
  solicitacao_agendamento: "Solicitação de agendamento",
  novo_cadastro: "Novo cadastro",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function resumirDados(tipo: string, dados: unknown): string {
  if (typeof dados !== "object" || !dados) return "—";
  const obj = dados as Record<string, unknown>;
  if (tipo === "solicitacao_agendamento") {
    const servico = obj.servico_nome ?? obj.servico ?? "Serviço";
    const dataHora = obj.data_hora_preferida ?? obj.data_hora ?? "";
    const dataLeg = typeof dataHora === "string" && dataHora ? ` em ${formatDate(dataHora)}` : "";
    return `${servico}${dataLeg}`;
  }
  if (tipo === "novo_cadastro") {
    return String(obj.nome_completo ?? obj.email ?? "Novo paciente");
  }
  return JSON.stringify(obj).slice(0, 100);
}

export function AprovacaoList({ aprovacoes, aprovarAction, recusarAction }: AprovacaoListProps) {
  const [processandoId, setProcessandoId] = useState<string | null>(null);
  const [errorById, setErrorById] = useState<Record<string, string>>({});

  async function handle(id: string, action: typeof aprovarAction) {
    setProcessandoId(id);
    setErrorById((e) => ({ ...e, [id]: "" }));
    const fd = new FormData();
    fd.set("id", id);
    const result = await action(fd);
    setProcessandoId(null);
    if (result.error) {
      setErrorById((e) => ({ ...e, [id]: result.error ?? "" }));
    }
  }

  if (aprovacoes.length === 0) {
    return (
      <Card>
        <div className={styles.empty}>
          <p>Nenhuma aprovação pendente.</p>
          <p className={styles.emptyHint}>
            Solicitações vindas do app do cliente aparecerão aqui.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.list}>
      {aprovacoes.map((a) => (
        <Card key={a.id}>
          <div className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.tipo}>{TIPO_LABELS[a.tipo] ?? a.tipo}</span>
              <span className={styles.data}>{formatDate(a.created_at)}</span>
            </div>
            <div className={styles.itemBody}>
              <span className={styles.solicitante}>
                {a.solicitante?.nome_completo ?? "—"}
              </span>
              <span className={styles.resumo}>{resumirDados(a.tipo, a.dados)}</span>
            </div>
            {errorById[a.id] && <div className={styles.itemError}>{errorById[a.id]}</div>}
            <div className={styles.itemActions}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handle(a.id, recusarAction)}
                disabled={processandoId === a.id}
              >
                Recusar
              </Button>
              <Button
                type="button"
                onClick={() => handle(a.id, aprovarAction)}
                disabled={processandoId === a.id}
              >
                {processandoId === a.id ? "..." : "Aprovar"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}