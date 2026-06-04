"use client";

import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/frontend/components/ui/cx";
import { Icon, type IconName } from "@/frontend/components/ui/Icon";

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  name: IconName;
  size?: number;
  iconSize?: number;
  badge?: boolean;
  active?: boolean;
  className?: string;
}

export function IconButton({
  name,
  size = 38,
  iconSize = 19,
  badge,
  active,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      className={cx("agn-iconbtn", active && "agn-iconbtn--active", className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      <Icon name={name} size={iconSize} />
      {badge && <span className="agn-iconbtn__badge" />}
    </button>
  );
}