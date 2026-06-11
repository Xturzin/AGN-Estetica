"use client";

import React, { useState } from "react";
import { Icon, Avatar } from "@/frontend/components/ui";
import { PhoneShell } from "@/frontend/components/cliente/Shell";

interface PerfilDoClienteProps {
  nome: string;
  email: string;
  logoutAction: () => Promise<void>;
}

export function PerfilDoCliente({ nome, email, logoutAction }: PerfilDoClienteProps) {
  const [aberto, setAberto] = useState<string | null>(null);
  const rows = [
    { id: "dados", icon: "user", label: "Dados pessoais", sub: "Nome, contato, endereço" },
    { id: "anamnese", icon: "clipboard", label: "Minha anamnese", sub: "Ficha de saúde" },
    { id: "docs", icon: "folder", label: "Documentos compartilhados", sub: "4 arquivos" },
    { id: "notif", icon: "bell", label: "Notificações", sub: "Lembretes e avisos" },
    { id: "priv", icon: "shield", label: "Privacidade e segurança" },
  ];

  return (
    <PhoneShell>
      <div style={{ padding: "16px 20px 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 8 }}>
          <Avatar name={nome} size={100} fontScale={0.36} ring />
          <h1 className="serif" style={{ fontSize: 22, fontWeight: 500, marginTop: 8 }}>{nome}</h1>
          <p style={{ fontSize: 13.5, color: "var(--ink-3)" }}>Cliente desde mar 2026</p>
          <span className="pill pill-warn"><span className="dot" />Em tratamento</span>
        </div>

        <div className="card" style={{ overflow: "hidden", boxShadow: "none", border: "1px solid var(--line)" }}>
          {rows.map((r, i) => (
            <div key={r.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none" }}>
              <button onClick={() => setAberto(aberto === r.id ? null : r.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "var(--ink)" }}>
                <span style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-tint)", color: "var(--accent-deep)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={r.icon} size={20} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{r.label}</div>
                  {r.sub && <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{r.sub}</div>}
                </div>
                <Icon name={aberto === r.id ? "chevronDown" : "chevronRight"} size={16} color="var(--ink-3)" />
              </button>

              {aberto === r.id && r.id === "dados" && (
                <div style={{ padding: "0 18px 16px", borderTop: "1px solid var(--line)", background: "var(--surface-2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 13 }}>
                    <span style={{ color: "var(--ink-3)" }}>Email</span><span style={{ color: "var(--ink)", fontWeight: 500 }}>{email}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <form action={logoutAction} style={{ marginTop: 14 }}>
          <button type="submit" style={{ width: "100%", padding: 14, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#c64545", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
            <Icon name="logout" size={18} />
            Sair da conta
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 11.5, color: "var(--ink-3)", marginTop: 12 }}>AGN Estética · versão 1.0</p>
      </div>
    </PhoneShell>
  );
}

export default PerfilDoCliente;