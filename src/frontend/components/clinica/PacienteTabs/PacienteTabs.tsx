"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Card, Icon } from "@/frontend/components/ui";
import type { Paciente } from "@/backend/services/pacienteService";
import styles from "./PacienteTabs.module.css";

const TABS = [
  { id: "resumo", label: "Resumo", iconName: "user" },
  { id: "anamnese", label: "Anamnese", iconName: "list" },
  { id: "atendimentos", label: "Atendimentos", iconName: "calendarCheck" },
  { id: "fotos", label: "Fotos", iconName: "grid" },
  { id: "documentos", label: "Documentos", iconName: "fileText" },
] as const;

interface PacienteTabsProps {
  paciente: Paciente;
}

export function PacienteTabs({ paciente }: PacienteTabsProps) {
  const sp = useSearchParams();
  const activeId = sp.get("aba") ?? "resumo";
  const basePath = `/pacientes/${paciente.id}`;

  return (
    <div className={styles.wrapper}>
      <nav className={styles.tabs} role="tablist">
        {TABS.map((t) => {
          const isActive = t.id === activeId;
          return (
            <Link
              key={t.id}
              href={`${basePath}?aba=${t.id}`}
              role="tab"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
            >
              <Icon name={t.iconName} size={16} />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.panel}>
        {activeId === "resumo" && <ResumoView paciente={paciente} />}
        {activeId === "anamnese" && (
          <PlaceholderView
            title="Anamnese"
            description="Formulário em 6 etapas com histórico de saúde do paciente."
            comingIn="2.3"
          />
        )}
        {activeId === "atendimentos" && (
          <PlaceholderView
            title="Atendimentos & Evoluções"
            description="Timeline clínica do paciente, com cada sessão e evolução registrada."
            comingIn="2.4"
          />
        )}
        {activeId === "fotos" && (
          <PlaceholderView
            title="Fotos clínicas"
            description="Galeria antes/durante/depois por sessão, com compressão automática."
            comingIn="2.5"
          />
        )}
        {activeId === "documentos" && (
          <PlaceholderView
            title="Documentos"
            description="Termos de consentimento, exames e PDFs do paciente."
            comingIn="2.6"
          />
        )}
      </div>
    </div>
  );
}

function ResumoView({ paciente }: { paciente: Paciente }) {
  const cidadeUf =
    paciente.cidade && paciente.estado
      ? `${paciente.cidade}/${paciente.estado}`
      : paciente.cidade ?? paciente.estado ?? null;

  return (
    <div className={styles.resumoGrid}>
      <ResumoCard title="Dados pessoais">
        <ResumoItem label="Nome completo" value={paciente.nome_completo} />
        <ResumoItem
          label="Data de nascimento"
          value={formatDate(paciente.data_nascimento)}
        />
        <ResumoItem label="CPF" value={paciente.cpf} />
      </ResumoCard>

      <ResumoCard title="Contato">
        <ResumoItem label="Telefone" value={paciente.telefone} />
        <ResumoItem label="E-mail" value={paciente.email} />
      </ResumoCard>

      <ResumoCard title="Endereço">
        <ResumoItem label="CEP" value={paciente.cep} />
        <ResumoItem label="Logradouro" value={paciente.logradouro} />
        <ResumoItem label="Bairro" value={paciente.bairro} />
        <ResumoItem label="Cidade/UF" value={cidadeUf} />
      </ResumoCard>

      <ResumoCard title="Registro">
        <ResumoItem
          label="Cadastrado em"
          value={formatDate(paciente.created_at)}
        />
        <ResumoItem
          label="Status"
          value={paciente.ativo ? "Ativo" : "Inativo"}
        />
      </ResumoCard>
    </div>
  );
}

function ResumoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <div className={styles.resumoCardBody}>
        <h3 className={styles.resumoCardTitle}>{title}</h3>
        <div className={styles.resumoItems}>{children}</div>
      </div>
    </Card>
  );
}

function ResumoItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className={styles.resumoItem}>
      <span className={styles.resumoLabel}>{label}</span>
      <span className={styles.resumoValue}>{value || "—"}</span>
    </div>
  );
}

function PlaceholderView({
  title,
  description,
  comingIn,
}: {
  title: string;
  description: string;
  comingIn: string;
}) {
  return (
    <Card>
      <div className={styles.placeholder}>
        <h3 className={styles.placeholderTitle}>{title}</h3>
        <p className={styles.placeholderDesc}>{description}</p>
        <span className={styles.placeholderBadge}>Sub-etapa {comingIn}</span>
      </div>
    </Card>
  );
}

function formatDate(d: string | null | undefined): string | null {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("pt-BR");
}