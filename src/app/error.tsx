"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        padding: 24,
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-head)",
          fontSize: 24,
          fontWeight: 700,
          margin: 0,
          color: "var(--ink)",
        }}
      >
        Algo deu errado
      </h2>
      <p style={{ fontSize: 14, color: "var(--ink-3)", maxWidth: 360, margin: 0 }}>
        Tente novamente. Se persistir, a equipe já foi notificada.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          padding: "10px 22px",
          background: "var(--accent-deep)",
          color: "#fff",
          border: "none",
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Tentar de novo
      </button>
    </div>
  );
}