import type { CSSProperties } from "react";

interface PhotoSlotProps {
  w?: string | number;
  h?: string | number;
  label?: string;
  radius?: string | number;
  src?: string;
  alt?: string;
  style?: CSSProperties;
}

export function PhotoSlot({
  w = "100%",
  h = 120,
  label,
  radius = "var(--r-md)",
  src,
  alt,
  style,
}: PhotoSlotProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- TODO: migrar para next/image na Etapa 0.4 (Supabase)
      <img
        src={src}
        alt={alt || label || ""}
        style={{
          width: w,
          height: h,
          borderRadius: radius,
          objectFit: "cover",
          display: "block",
          ...style,
        }}
      />
    );
  }
  return (
    <div className="agn-photo" style={{ width: w, height: h, borderRadius: radius, ...style }}>
      {label && <span className="agn-photo__tag">{label}</span>}
    </div>
  );
}