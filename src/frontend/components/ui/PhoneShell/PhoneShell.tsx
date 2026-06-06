import type { CSSProperties, ReactNode } from "react";
import { cx } from "../cx";
import styles from "./PhoneShell.module.css";

interface PhoneShellProps {
  children: ReactNode;
  bg?: string;
  className?: string;
}

export function PhoneShell({ children, bg, className }: PhoneShellProps) {
  const style: CSSProperties | undefined = bg ? { background: bg } : undefined;
  return (
    <div className={cx(styles.shell, className)} style={style}>
      {children}
    </div>
  );
}