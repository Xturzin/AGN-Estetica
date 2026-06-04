"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "@/frontend/components/ui/cx";
import { Icon, type IconName } from "@/frontend/components/ui/Icon";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  icon?: IconName;
  suffix?: ReactNode;
  className?: string;
}

export function Input({
  label,
  icon,
  suffix,
  type = "text",
  className,
  ...rest
}: InputProps) {
  return (
    <label className={cx("agn-field", className)}>
      {label && <span className="agn-label">{label}</span>}
      <span className="agn-input">
        {icon && <Icon name={icon} size={18} color="var(--ink-4)" />}
        <input type={type} {...rest} />
        {suffix}
      </span>
    </label>
  );
}