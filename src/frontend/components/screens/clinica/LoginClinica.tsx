"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, Logo, Btn, Field } from "@/frontend/components/ui";

interface LoginClinicaProps {
  loginAction: (formData: FormData) => Promise<{ error?: string }>;
}

export function LoginClinica({ loginAction }: LoginClinicaProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [manterConectado, setManterConectado] = useState(true);
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
    <div className="es" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100vh", background: "var(--surface)" }}>
      {/* hero grafite à esquerda */}
      <div
        style={{
          background: "#2c3036",
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 22px, rgba(255,255,255,0.03) 22px 24px)",
          color: "#fff",
          padding: "44px 56px 48px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative" }}>
          <Logo size={22} dark />
        </div>

        <div style={{ position: "relative", marginTop: "auto", marginBottom: 80 }}>
          <div
            className="eyebrow"
            style={{ color: "rgba(255,255,255,.55)", letterSpacing: ".15em", marginBottom: 18 }}
          >
            PLATAFORMA DE GESTÃO CLÍNICA
          </div>
          <h1
            className="serif"
            style={{
              fontSize: 42,
              fontWeight: 500,
              color: "#fff",
              letterSpacing: "-.028em",
              lineHeight: 1.12,
              maxWidth: 520,
            }}
          >
            O cuidado da sua paciente, organizado num só lugar.
          </h1>
          <p
            style={{
              fontSize: 14.5,
              color: "rgba(255,255,255,.62)",
              marginTop: 18,
              maxWidth: 440,
              lineHeight: 1.55,
            }}
          >
            Agenda, prontuário e evolução clínica reunidos numa experiência pensada para o dia a dia da sua clínica.
          </p>
        </div>

        {/* stats rodapé */}
        <div style={{ position: "relative", display: "flex", gap: 56 }}>
          <div>
            <div className="num" style={{ fontSize: 30, fontWeight: 600, color: "#fff", lineHeight: 1 }}>
              +1.200
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 6 }}>clínicas ativas</div>
          </div>
          <div>
            <div className="num" style={{ fontSize: 30, fontWeight: 600, color: "#fff", lineHeight: 1 }}>
              98%
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginTop: 6 }}>de satisfação</div>
          </div>
        </div>
      </div>

      {/* form à direita */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, background: "var(--surface)" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2
            className="serif"
            style={{ fontSize: 30, fontWeight: 500, letterSpacing: "-.02em", color: "var(--ink)" }}
          >
            Acesse sua conta
          </h2>
          <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 8 }}>
            Bem-vinda de volta. Entre para continuar.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
            <Field label="E-mail" icon="mail" value={email} onChange={setEmail} placeholder="seu@email.com" />

            <Field
              label="Senha"
              icon="lock"
              type={showPassword ? "text" : "password"}
              value={senha}
              onChange={setSenha}
              placeholder="Sua senha"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: 0,
                    cursor: "pointer",
                    color: "var(--ink-3)",
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                    marginRight: -4,
                  }}
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  <Icon name="eye" size={18} />
                </button>
              }
            />

            {/* manter conectado + esqueci */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -2 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", userSelect: "none" }}>
                <span
                  onClick={() => setManterConectado(!manterConectado)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: manterConectado ? "none" : "1.5px solid var(--line-2)",
                    background: manterConectado ? "var(--accent)" : "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "background .15s",
                  }}
                >
                  {manterConectado && <Icon name="check" size={12} sw={2.6} color="#fff" />}
                </span>
                <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>Manter conectado</span>
              </label>
              <a style={{ fontSize: 13.5, color: "var(--accent)", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
                Esqueci a senha
              </a>
            </div>

            {erro && (
              <div style={{ padding: "10px 14px", background: "#fde6e6", color: "#c64545", borderRadius: 10, fontSize: 13 }}>
                {erro}
              </div>
            )}

            <Btn variant="primary" size="lg" block type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Btn>

            {/* divisor */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--ink-4)", margin: "2px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
              <span style={{ fontSize: 12 }}>ou</span>
              <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            </div>

            <Btn variant="ghost" size="lg" block icon="shield">
              Entrar com SSO corporativo
            </Btn>

            <p style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", marginTop: 8 }}>
              É uma clínica nova?{" "}
              <a style={{ color: "var(--accent)", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
                Solicite uma demonstração
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginClinica;