"use client";

import type { CSSProperties } from "react";
import { useFormState } from "react-dom";
import { Button, Input } from "@/frontend/components/ui";

export type LoginActionResult = { error: string } | null;

interface LoginFormProps {
  action: (prev: LoginActionResult, formData: FormData) => Promise<LoginActionResult>;
  identifierLabel?: string;
  submitLabel?: string;
  rememberForgot?: boolean;
}

const forgotLinkStyle: CSSProperties = {
  color: "var(--accent)",
  fontWeight: 600,
  textDecoration: "none",
  fontSize: 13,
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontFamily: "inherit",
};

export function LoginForm({
  action,
  identifierLabel = "E-mail ou usuário",
  submitLabel = "Entrar",
  rememberForgot = true,
}: LoginFormProps) {
  const [state, formAction] = useFormState(action, null);

  return (
    <form action={formAction}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <Input
          label={identifierLabel}
          name="identifier"
          icon="mail"
          required
          autoComplete="username"
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          icon="lock"
          required
          autoComplete="current-password"
        />

        {rememberForgot && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -4 }}>
            {/* TODO: fluxo de recuperação de senha em sub-etapa futura */}
            <button type="button" style={forgotLinkStyle}>
              Esqueci a senha
            </button>
          </div>
        )}

        {state?.error && (
          <p style={{ color: "var(--warn-ink)", fontSize: 13, margin: 0 }}>
            {state.error}
          </p>
        )}

        <Button block size="lg" type="submit" style={{ marginTop: 6 }}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}