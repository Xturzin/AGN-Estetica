"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button, Card, Input } from "@/frontend/components/ui";
import { useCEP } from "@/frontend/hooks/useCEP";
import type { Clinica } from "@/backend/services/clinicaService";
import styles from "./ClinicaForm.module.css";

export type ClinicaFormResult = { error: string } | { success: string } | null;

interface ClinicaFormProps {
  clinica: Clinica;
  action: (
    prev: ClinicaFormResult,
    formData: FormData
  ) => Promise<ClinicaFormResult>;
}

function extractHorarioTexto(horario: Clinica["horario_funcionamento"]): string {
  if (!horario) return "";
  if (typeof horario === "string") return horario;
  if (typeof horario === "object" && horario !== null && "texto" in horario) {
    return String((horario as { texto: unknown }).texto ?? "");
  }
  return "";
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Salvando..." : "Salvar alterações"}
    </Button>
  );
}

export function ClinicaForm({ clinica, action }: ClinicaFormProps) {
  const [state, formAction] = useFormState(action, null);
  const { data: cepData, error: cepError, loading: cepLoading, lookup } = useCEP();

  const [cep, setCep] = useState(clinica.cep ?? "");
  const [endereco, setEndereco] = useState(clinica.endereco ?? "");

  useEffect(() => {
    if (cepData) {
      const concat = [
        cepData.logradouro,
        cepData.bairro,
        cepData.cidade && cepData.estado ? `${cepData.cidade}/${cepData.estado}` : null,
      ]
        .filter(Boolean)
        .join(" - ");
      setEndereco(concat);
    }
  }, [cepData]);

  function handleCepBlur() {
    const cleanCep = cep.replace(/\D/g, "");
    const originalCep = (clinica.cep ?? "").replace(/\D/g, "");
    if (cleanCep.length === 8 && cleanCep !== originalCep) {
      void lookup(cleanCep);
    }
  }

  const horarioInicial = extractHorarioTexto(clinica.horario_funcionamento);

  return (
    <form action={formAction} className={styles.form}>
      {state && "error" in state && (
        <div className={`${styles.feedback} ${styles.feedbackError}`}>{state.error}</div>
      )}
      {state && "success" in state && (
        <div className={`${styles.feedback} ${styles.feedbackSuccess}`}>{state.success}</div>
      )}

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Identidade</h2>
          <p className={styles.sectionSubtitle}>Nome e identificação fiscal da clínica.</p>
          <Input label="Nome da clínica" name="nome" defaultValue={clinica.nome} required />
          <Input
            label="CNPJ"
            name="cnpj"
            defaultValue={clinica.cnpj ?? ""}
            placeholder="00.000.000/0000-00"
          />
        </div>
      </Card>

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contato</h2>
          <p className={styles.sectionSubtitle}>Como pacientes e equipe entram em contato.</p>
          <div className={styles.row}>
            <Input
              label="Telefone"
              name="telefone"
              defaultValue={clinica.telefone ?? ""}
              icon="phone"
            />
            <Input
              label="E-mail"
              name="email"
              type="email"
              defaultValue={clinica.email ?? ""}
              icon="mail"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Endereço</h2>
          <p className={styles.sectionSubtitle}>
            Digite o CEP e o endereço é preenchido automaticamente.
          </p>
          <div className={styles.rowCepEndereco}>
            <Input
              label="CEP"
              name="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={handleCepBlur}
              placeholder="00000-000"
            />
            <Input
              label="Endereço"
              name="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, bairro, cidade/UF"
            />
          </div>
          {cepLoading && <p className={styles.cepHelp}>Buscando CEP...</p>}
          {cepError && <p className={styles.cepError}>{cepError}</p>}
        </div>
      </Card>

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Horário de funcionamento</h2>
          <p className={styles.sectionSubtitle}>
            Descreva em texto livre (ex: Seg-Sex 9h-18h, Sáb 9h-12h).
          </p>
          <Input
            label="Horário"
            name="horario_texto"
            defaultValue={horarioInicial}
            placeholder="Seg-Sex 9h-18h, Sáb 9h-12h"
          />
        </div>
      </Card>

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Identidade visual</h2>
          <p className={styles.sectionSubtitle}>
            URL do logo da clínica. Upload de arquivo virá em etapa futura.
          </p>
          <Input
            label="URL do logo"
            name="logo_url"
            type="url"
            defaultValue={clinica.logo_url ?? ""}
            placeholder="https://..."
            icon="image"
          />
        </div>
      </Card>

      <div className={styles.actions}>
        <SubmitButton />
      </div>
    </form>
  );
}