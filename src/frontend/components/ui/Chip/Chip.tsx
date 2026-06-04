"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/frontend/components/ui/cx";
import { Icon, type IconName } from "@/frontend/components/ui/Icon";

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  active?: boolean;
  icon?: IconName;
  children?: ReactNode;
  className?: string;
}

export function Chip({ active, icon, children, className, ...rest }: ChipProps) {
  return (
    <button className={cx("agn-chip", active && "agn-chip--active", className)} {...rest}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}