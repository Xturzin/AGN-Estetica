interface LogoProps {
  size?: number;
  mark?: boolean;
  wordmark?: boolean;
  dark?: boolean;
}

export function Logo({ size = 19, mark = true, wordmark = true, dark = false }: LogoProps) {
  const c = dark ? "#fff" : "var(--accent)";
  const ink = dark ? "#fff" : "var(--ink)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {mark && (
        <svg width={size + 5} height={size + 5} viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12.2" stroke={c} strokeWidth="1.5" />
          <circle cx="14" cy="14" r="6.2" stroke={c} strokeWidth="1.5" />
          <circle cx="14" cy="14" r="1.7" fill={c} />
        </svg>
      )}
      {wordmark && (
        <span
          className="agn-head"
          style={{
            fontSize: size,
            fontWeight: 800,
            color: ink,
            letterSpacing: "-.04em",
            whiteSpace: "nowrap",
          }}
        >
          AGN{" "}
          <span
            style={{
              fontWeight: 500,
              color: dark ? "rgba(255,255,255,.7)" : "var(--accent)",
            }}
          >
            Estética
          </span>
        </span>
      )}
    </div>
  );
}