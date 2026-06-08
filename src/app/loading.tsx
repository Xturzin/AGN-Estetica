export default function GlobalLoading() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        color: "var(--ink-3)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid var(--ink-4)",
          borderTopColor: "var(--accent-deep)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: 13.5 }}>Carregando...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}