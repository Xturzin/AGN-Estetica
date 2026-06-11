"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo, Btn, Field } from "@/frontend/components/ui";
import { StatusBar } from "@/frontend/components/cliente/Shell";

interface LoginClienteProps {
  loginAction: (formData: FormData) => Promise<{ error?: string }>;
}

export function LoginCliente({ loginAction }: LoginClienteProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    const fd = new FormData();
    fd.set("identifier", email);
    fd.set("password", senha);
    const result = await loginAction(fd);
    if (result.error) {
      setErro(result.error);
      setLoading(false);
    } else {
      router.push("/cliente/home");
      router.refresh();
    }
  }

  return (
    <div className="es" style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--surface)" }}>
      <StatusBar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 24px" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Logo size={20} />
          <h1 className="serif" style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-.02em", marginTop: 28 }}>Bem-vinda</h1>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6 }}>Entre para ver suas consultas e histórico.</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 28 }}>
            <Field label="E-mail" icon="mail" value={email} onChange={setEmail} placeholder="seu@email.com" />
            <Field label="Senha" icon="lock" type="password" value={senha} onChange={setSenha} placeholder="Sua senha" />

            <a style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, alignSelf: "flex-end", marginTop: -8 }}>Esqueci a senha</a>

            {erro && <div style={{ padding: "10px 14px", background: "#fde6e6", color: "#c64545", borderRadius: 10, fontSize: 13 }}>{erro}</div>}

            <Btn variant="primary" size="lg" block type="submit">{loading ? "Entrando..." : "Entrar"}</Btn>
          </form>
        </div>

        <div style={{ paddingBottom: 32, textAlign: "center" }}>
          <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
            Sou da equipe da clínica{" "}
            <a href="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>Acessar painel</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginCliente;