import type { ReactNode } from "react";
import { Icon, type IconName } from "@/frontend/components/ui/Icon";

interface CardHeadProps {
  title: string;
  sub?: string;
  icon?: IconName;
  action?: ReactNode;
}

export function CardHead({ title, sub, icon, action }: CardHeadProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 18,
      }}
    >
      <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
        {icon && (
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(var(--accent-shadow),.3)",
              flex: "0 0 auto",
            }}
          >
            <Icon name={icon} size={17} color="#fff" />
          </div>
        )}
        <div>
          <h3 className="agn-head" style={{ fontSize: 18 }}>{title}</h3>
          {sub && <p style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}