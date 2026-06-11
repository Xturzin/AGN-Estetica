"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/backend/lib/supabase/browser";
import { Button, Input, Logo } from "@/frontend/components/ui";
import styles from "./callback.module.css";

type InitState =
  | { type: "loading" }
  | { type: "ready" }
  | { type: "error"; message: string };

type SubmissionState =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "error"; message: string }
  | { type: "success" };

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/login";

  const [init, setInit] = useState<InitState>({ type: "loading" });
  const [submission, setSubmission] = useState<SubmissionState>({ type: "idle" });

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setInit({ type: "ready" });
        } else {
          setInit({
            type: "error",
            message: "Link de convite inválido ou expirado.",
          });
        }
      });
      return;
    }

    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) {
          setInit({ type: "error", message: error.message });
        } else {
          setInit({ type: "ready" });
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
          );
        }
      });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirm_password") ?? "");

    if (password.length < 8) {
      setSubmission({ type: "error", message: "Senha deve ter pelo menos 8 caracteres." });
      return;
    }
    if (password !== confirmPassword) {
      setSubmission({ type: "error", message: "As senhas não coincidem." });
      return;
    }

    setSubmission({ type: "submitting" });

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setSubmission({ type: "error", message: error.message });
      return;
    }

    setSubmission({ type: "success" });
    setTimeout(() => router.push(next), 1500);
  }

  if (init.type === "loading") {
    return (
      <div className={styles.container}>
        <div className={styles.box}>
          <Logo size={20} />
          <p className={styles.muted}>Validando convite...</p>
        </div>
      </div>
    );
  }

  if (init.type === "error") {
    return (
      <div className={styles.container}>
        <div className={styles.box}>
          <Logo size={20} />
          <h1 className={styles.title}>Não foi possível abrir o convite</h1>
          <div className={styles.errorBox}>{init.message}</div>
          <p className={styles.muted}>
            Peça à clínica para reenviar o convite ou tente abrir o link novamente.
          </p>
        </div>
      </div>
    );
  }

  if (submission.type === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.box}>
          <Logo size={20} />
          <h1 className={styles.title}>Senha definida ✓</h1>
          <p className={styles.muted}>Redirecionando...</p>
        </div>
      </div>
    );
  }

  const isSubmitting = submission.type === "submitting";

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <Logo size={20} />
        <h1 className={styles.title}>Defina sua senha</h1>
        <p className={styles.muted}>
          Seu cadastro foi criado pela clínica. Defina uma senha para acessar.
        </p>

        {submission.type === "error" && (
          <div className={styles.errorBox}>{submission.message}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Nova senha"
            name="password"
            type="password"
            required
            placeholder="Mínimo 8 caracteres"
            icon="lock"
          />
          <Input
            label="Confirmar senha"
            name="confirm_password"
            type="password"
            required
            placeholder="Repita a senha"
            icon="lock"
          />
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Definir senha"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.box}>
            <Logo size={20} />
            <p className={styles.muted}>Carregando...</p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}