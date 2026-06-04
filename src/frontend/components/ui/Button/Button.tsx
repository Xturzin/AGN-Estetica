"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/frontend/components/ui/cx";
import { Icon, type IconName } from "@/frontend/components/ui/Icon";

type ButtonVariant = "primary" | "ghost" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  block?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  block,
  children,
  className,
  ...rest
}: ButtonProps) {
  const isz = size === "sm" ? 16 : size === "lg" ? 19 : 17;
  return (
    <button
      className={cx(
        "agn-btn",
        `agn-btn--${variant}`,
        size !== "md" && `agn-btn--${size}`,
        block && "agn-btn--block",
        className
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={isz} sw={1.7} />}
      {children}
      {iconRight && <Icon name={iconRight} size={isz} sw={1.7} />}
    </button>
  );
}