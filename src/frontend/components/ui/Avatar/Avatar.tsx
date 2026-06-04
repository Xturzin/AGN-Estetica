const AV_TONES = ["#5a73c9", "#7a6fc4", "#c47a6f", "#5f9d97", "#c2a05a", "#6f8a86"];

interface AvatarProps {
  name?: string;
  size?: number;
  src?: string;
  ring?: boolean;
  fontScale?: number;
}

export function Avatar({ name = "", size = 40, src, ring = false, fontScale = 0.4 }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const tone = AV_TONES[(name.charCodeAt(0) + name.length) % AV_TONES.length] || AV_TONES[0];
  return (
    <div
      className="agn-avatar"
      style={{
        width: size,
        height: size,
        background: src ? "#dfe5ee" : tone,
        fontSize: size * fontScale,
        boxShadow: ring ? "0 0 0 3px var(--surface), 0 0 0 4px var(--line-2)" : "none",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- TODO: migrar para next/image na Etapa 0.4 (Supabase)
        <img src={src} alt={name} />
      ) : (
        initials
      )}
    </div>
  );
}