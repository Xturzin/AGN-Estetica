import type { ReactNode } from "react";
import { cx } from "@/frontend/components/ui/cx";

interface PillProps {
  kind?: "ok" | "warn" | "info" | "muted";
  children?: ReactNode;
}

export function Pill({ kind = "ok", children }: PillProps) {
  return (
    <span className={cx("agn-pill", `agn-pill--${kind}`)}>
      <span className="agn-pill__dot" />
      {children}
    </span>
  );
}