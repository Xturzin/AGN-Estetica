"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo, Btn, Field } from "@/frontend/components/ui";

interface LoginClinicaProps {
  loginAction: (formData: FormData) => Promise<{ error?: string }>;
}

export function LoginClinica({ loginAction }: LoginClinicaProps) {
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
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="es" style={{ display: "flex", height: "100vh", background: "var(--bg)" }}>
      {/* hero cobalto */}
      <div style={{
        flex: 1, background: "linear-gradient(135deg, #1357d6 0%, #1f6dff 100%)",
        position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: 48,
      }}>
        <div className="soft-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.18 }} />
        <div style={{ position: "relative" }}><Logo size={22} dark /></div>
        <div style={{ position: "relative", marginTop: "auto" }}>
          <div className="eyebrow" style={{ color: "rgba(255,255,255,.7)", marginBottom: 16 }}>Plataforma de gestão clínica</div>
          <h1 className="serif" style={{ fontSize: 38, fontWeight: 500, color: "#fff", letterSpacing: "-.025em", lineHeight: 1.15, maxWidth: 480 }}>
            O cuidado da sua paciente, organizado num só lugar.
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.75)", marginTop: 16, maxWidth: 440, lineHeight: 1.5 }}>
            Agenda, prontuário e evolução clínica reunidos numa experiência pensada para o dia a dia da sua clínica.
          </p>
        </div>
      </div>

      {/* form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 className="serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-.02em" }}>Acesse sua conta</h2>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 6 }}>Bem-vinda de volta. Entre para continuar.</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 32 }}>
            <Field label="E-mail ou usuário" icon="mail" value={email} onChange={setEmail} placeholder="seu@email.com" />
            <Field label="Senha" icon="lock" type="password" value={senha} onChange={setSenha} placeholder="Sua senha" />

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8 }}>
              <a style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>Esqueci a senha</a>
            </div>

            {erro && (
              <div style={{ padding: "10px 14px", background: "#fde6e6", color: "#c64545", borderRadius: 10, fontSize: 13 }}>
                {erro}
              </div>
            )}

            <Btn variant="primary" size="lg" block type="submit">
              {loading ? "Entrando..." : "Entrar"}
            </Btn>
          </form>

          <div style={{ marginTop: 28, paddingTop: 22, borderTop: "1px solid var(--line)", textAlign: "center" }}>
            <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
              É paciente?{" "}
              <a href="/cliente/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Acesse o app</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginClinica;