import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/frontend/components/ui/cx";

interface CardProps {
  pad?: boolean;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Card({ pad = true, className, children, style }: CardProps) {
  return (
    <div className={cx("agn-card", pad && "agn-card--pad", className)} style={style}>
      {children}
    </div>
  );
}