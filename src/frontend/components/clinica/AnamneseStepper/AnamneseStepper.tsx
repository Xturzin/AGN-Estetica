"use client";

import { useState, type FormEvent } from "react";
import { Button, Card, Input } from "@/frontend/components/ui";
import { STEPS, type FieldDef, type SecaoId } from "./steps";
import styles from "./AnamneseStepper.module.css";

export interface AnamneseSaveResult {
  error?: string;
  success?: string;
}

type SecaoData = Record<string, unknown>;
type AllData = Record<SecaoId, SecaoData>;

interface AnamneseStepperProps {
  initialData: AllData;
  canEdit: boolean;
  saveAction: (formData: FormData) => Promise<AnamneseSaveResult>;
}

export function AnamneseStepper({
  initialData,
  canEdit,
  saveAction,
}: AnamneseStepperProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AllData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AnamneseSaveResult | null>(null);

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  function getValue(secaoId: SecaoId, fieldName: string): unknown {
    return data[secaoId]?.[fieldName];
  }

  function setValue(secaoId: SecaoId, fieldName: string, value: unknown) {
    setData((prev) => ({
      ...prev,
      [secaoId]: {
        ...(prev[secaoId] ?? {}),
        [fieldName]: value,
      },
    }));
  }

  function goTo(index: number) {
    if (index < 0 || index >= STEPS.length) return;
    setStep(index);
    setFeedback(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canEdit) {
      goTo(step + 1);
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("secao", currentStep.id);
    formData.append("dados", JSON.stringify(data[currentStep.id] ?? {}));
    formData.append("is_last", isLast ? "true" : "false");

    const result = await saveAction(formData);
    setSubmitting(false);

    if (result.error) {
      setFeedback(result);
      return;
    }

    if (isLast) {
      setFeedback({ success: "Anamnese finalizada." });
    } else {
      goTo(step + 1);
    }
  }

  return (
    <div className={styles.wrapper}>
      <StepperNav currentStep={step} onJump={goTo} />

      <Card>
        <div className={styles.stepBody}>
          <header className={styles.stepHeader}>
            <h2 className={styles.stepTitle}>{currentStep.title}</h2>
            <p className={styles.stepDesc}>{currentStep.description}</p>
          </header>

          {feedback?.error && (
            <div className={styles.feedbackError}>{feedback.error}</div>
          )}
          {feedback?.success && (
            <div className={styles.feedbackSuccess}>{feedback.success}</div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fields}>
              {currentStep.fields.map((field) => (
                <FieldRenderer
                  key={field.name}
                  field={field}
                  value={getValue(currentStep.id, field.name)}
                  onChange={(v) => setValue(currentStep.id, field.name, v)}
                  disabled={!canEdit}
                />
              ))}
            </div>

            <footer className={styles.footer}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => goTo(step - 1)}
                disabled={isFirst || submitting}
              >
                Anterior
              </Button>

              <div className={styles.footerSpacer} />

              {!canEdit ? (
                <Button
                  type="button"
                  onClick={() => goTo(step + 1)}
                  disabled={isLast}
                >
                  Próximo
                </Button>
              ) : (
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Salvando..."
                    : isLast
                      ? "Salvar e finalizar"
                      : "Salvar e avançar"}
                </Button>
              )}
            </footer>
          </form>
        </div>
      </Card>

      {!canEdit && (
        <p className={styles.readOnlyHint}>
          Modo somente leitura. Apenas membros com permissão de editar prontuário podem salvar.
        </p>
      )}
    </div>
  );
}

function StepperNav({
  currentStep,
  onJump,
}: {
  currentStep: number;
  onJump: (index: number) => void;
}) {
  return (
    <nav className={styles.stepperNav}>
      {STEPS.map((s, i) => {
        const isActive = i === currentStep;
        const isPast = i < currentStep;
        const className = `${styles.stepDot} ${
          isActive ? styles.stepDotActive : isPast ? styles.stepDotPast : ""
        }`;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onJump(i)}
            className={className}
          >
            <span className={styles.stepNum}>{i + 1}</span>
            <span className={styles.stepLabel}>{s.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  disabled,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  disabled: boolean;
}) {
  if (field.type === "textarea") {
    return (
      <div className={styles.field}>
        <label className={styles.label}>{field.label}</label>
        <textarea
          name={field.name}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows ?? 3}
          disabled={disabled}
          className={styles.textarea}
        />
      </div>
    );
  }

  if (field.type === "radio") {
    return (
      <div className={styles.field}>
        <label className={styles.label}>{field.label}</label>
        <div className={styles.radioGroup}>
          {field.options?.map((opt) => (
            <label key={opt.value} className={styles.radioOption}>
              <input
                type="radio"
                name={field.name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                disabled={disabled}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <Input
        label={field.label}
        type="number"
        value={value === undefined || value === null ? "" : String(value)}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
        disabled={disabled}
        placeholder={field.placeholder}
      />
    );
  }

  return (
    <Input
      label={field.label}
      type="text"
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={field.placeholder}
    />
  );
}