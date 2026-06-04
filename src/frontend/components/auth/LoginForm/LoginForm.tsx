"use client";

import { useFormState } from "react-dom";
import { Button, Card, Input, Logo } from "@/frontend/components/ui";

export type LoginActionResult = { error: string } | null;

interface LoginFormProps {
  action: (prev: LoginActionResult, formData: FormData) => Promise<LoginActionResult>;
  title: string;
  subtitle?: string;
}

export function LoginForm({ action, title, subtitle }: LoginFormProps) {
  const [state, formAction] = useFormState(action, null);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 400 }}>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Logo size={28} />
          <h1 className="agn-head" style={{ fontSize: 22, textAlign: "center" }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: "var(--ink-3)", fontSize: 14, margin: 0, textAlign: "center" }}>
              {subtitle}
            </p>
          )}
        </div>

        <form action={formAction}>
          <div style={{ display: "grid", gap: 12 }}>
            <Input label="E-mail ou usuário" name="identifier" required autoComplete="username" />
            <Input
              label="Senha"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
            {state?.error && (
              <p style={{ color: "var(--warn-ink)", fontSize: 13, margin: 0 }}>{state.error}</p>
            )}
            <Button block type="submit">
              Entrar
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}