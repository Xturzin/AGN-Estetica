import React from "react";
import { Icon } from "./Icon";

export function Logo({ size = 19, mono = false, dark = false }: { size?: number; mono?: boolean; dark?: boolean }) {
  const c = dark ? "#fff" : "var(--accent)";
  const ink = dark ? "#fff" : "var(--ink)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size + 5} height={size + 5} viewBox="0 0 28 28" fill="none" style={{ display: "block" }}>
        <circle cx="14" cy="14" r="12.2" stroke={c} strokeWidth="1.5" />
        <circle cx="14" cy="14" r="6.2" stroke={c} strokeWidth="1.5" />
        <circle cx="14" cy="14" r="1.7" fill={c} />
      </svg>
      {!mono && (
        <span className="serif" style={{ fontSize: size, fontWeight: 800, color: ink, letterSpacing: "-.04em" }}>
          AGN <span style={{ fontWeight: 500, color: dark ? "rgba(255,255,255,.7)" : "var(--accent)" }}>Estética</span>
        </span>
      )}
    </div>
  );
}

export const AV_TONES = ["#7d918b", "#8a8395", "#9a7d72", "#6f8a86", "#a08a6a", "#83887a"];

export function Avatar({ name = "", size = 40, src, ring = false, fontScale = 0.4 }: {
  name?: string; size?: number; src?: string; ring?: boolean; fontScale?: number;
}) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const tone = AV_TONES[(name.charCodeAt(0) + name.length) % AV_TONES.length];
  return (
    <div
      className="avatar"
      style={{
        width: size, height: size, background: src ? "#eceae4" : tone,
        fontSize: size * fontScale,
        boxShadow: ring ? "0 0 0 3px var(--surface), 0 0 0 4px var(--line-2)" : "none",
      }}
    >
      {src ? <div className="ph-img" style={{ width: "100%", height: "100%" }} /> : initials}
    </div>
  );
}

export function Pill({ kind = "ok", children }: { kind?: "ok" | "warn" | "muted" | "info"; children: React.ReactNode }) {
  const map: Record<string, string> = { ok: "pill-ok", warn: "pill-warn", muted: "pill-muted", info: "pill-info" };
  return <span className={"pill " + (map[kind] || "pill-muted")}><span className="dot" />{children}</span>;
}

export function PhotoSlot({ w = "100%", h = 120, label, radius = "var(--r-md)", style }: {
  w?: string | number; h?: string | number; label?: string; radius?: string | number; style?: React.CSSProperties;
}) {
  return (
    <div className="ph-img" style={{ width: w, height: h, borderRadius: radius, ...style }}>
      {label && <span className="ph-tag">{label}</span>}
    </div>
  );
}

export function Btn({ variant = "primary", size, icon, iconR, block, children, style, onClick, type, disabled }: {
  variant?: "primary" | "ghost" | "quiet"; size?: "sm" | "lg"; icon?: string; iconR?: string;
  block?: boolean; children?: React.ReactNode; style?: React.CSSProperties;
  onClick?: () => void; type?: "button" | "submit"; disabled?: boolean;
}) {
  const cls = ["btn", "btn-" + variant];
  if (size === "sm") cls.push("btn-sm");
  if (size === "lg") cls.push("btn-lg");
  if (block) cls.push("btn-block");
  const isz = size === "sm" ? 16 : size === "lg" ? 19 : 17;
  return (
    <button
      type={type ?? "button"}
      className={cls.join(" ")}
      style={{ ...style, opacity: disabled ? 0.55 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={isz} sw={1.7} />}
      {children}
      {iconR && <Icon name={iconR} size={isz} sw={1.7} />}
    </button>
  );
}

export function Field({ label, value, defaultValue, placeholder, icon, focus, suffix, type, onChange, name, required, disabled }: {
  label?: string; value?: string; defaultValue?: string; placeholder?: string; icon?: string; focus?: boolean;
  suffix?: React.ReactNode; type?: string; onChange?: (v: string) => void; name?: string;
  required?: boolean; disabled?: boolean;
}) {
  // Modo "display" só quando NÃO tem name nem onChange nem defaultValue (uso readonly em hero/perfil).
  const isInteractive = !!name || typeof onChange === "function" || defaultValue !== undefined;

  return (
    <div className="field">
      {label && <span className="label">{label}</span>}
      <div className={"input" + (focus ? " input-focus" : "")} style={{ gap: 10, opacity: disabled ? 0.6 : 1 }}>
        {icon && <Icon name={icon} size={18} color="var(--ink-4)" />}
        {isInteractive ? (
          <input
            name={name}
            type={type ?? "text"}
            required={required}
            disabled={disabled}
            defaultValue={defaultValue}
            value={typeof onChange === "function" ? (value ?? "") : undefined}
            placeholder={placeholder}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            style={{ border: 0, outline: 0, background: "transparent", font: "inherit", color: "inherit", flex: 1, width: "100%", padding: 0 }}
          />
        ) : (
          <span style={{ flex: 1, color: value ? "var(--ink)" : "var(--ink-4)" }}>
            {type === "password" && value ? "••••••••••" : (value || placeholder)}
          </span>
        )}
        {suffix}
      </div>
    </div>
  );
}

export function CardHead({ title, action, sub, icon }: {
  title: string; action?: React.ReactNode; sub?: string; icon?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
      <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
        {icon && (
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--accent)", display: "flex",
            alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(31,109,255,.3)", flex: "0 0 auto" }}>
            <Icon name={icon} size={17} color="#fff" />
          </div>
        )}
        <div>
          <h3 className="serif" style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-.01em" }}>{title}</h3>
          {sub && <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function IconBtn({ name, size = 38, isz = 19, badge, onClick, active }: {
  name: string; size?: number; isz?: number; badge?: boolean; onClick?: () => void; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: 11, border: "1px solid var(--line-2)",
        background: active ? "var(--accent-tint)" : "var(--surface)", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: "var(--ink-2)",
      }}
    >
      <Icon name={name} size={isz} />
      {badge && <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 0 2px var(--surface)" }} />}
    </button>
  );
}

export function Toggle({ on, onChange }: { on?: boolean; onChange?: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 42, height: 25, borderRadius: 999, background: on ? "var(--accent)" : "var(--line-2)", padding: 3,
        display: "flex", justifyContent: on ? "flex-end" : "flex-start", transition: "background .2s", flex: "0 0 auto",
        cursor: onChange ? "pointer" : "default",
      }}
    >
      <div style={{ width: 19, height: 19, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} />
    </div>
  );
}

export function YesNo({ yes }: { yes?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <span className={"chip" + (yes ? " chip-active" : "")} style={{ padding: "5px 16px" }}>Sim</span>
      <span className={"chip" + (!yes ? " chip-active" : "")} style={{ padding: "5px 16px" }}>Não</span>
    </div>
  );
}

export function Card({ children, style, padded = false }: { children: React.ReactNode; style?: React.CSSProperties; padded?: boolean }) {
  return <div className={padded ? "card card-pad" : "card"} style={style}>{children}</div>;
}

export const Button = Btn;
export const IconButton = IconBtn;
export const Input = Field;
export function Hr({ style }: { style?: React.CSSProperties }) { return <hr className="hr" style={style} />; }