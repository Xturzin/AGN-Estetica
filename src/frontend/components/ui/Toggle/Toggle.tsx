"use client";

import { cx } from "@/frontend/components/ui/cx";

interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cx("agn-toggle", checked && "agn-toggle--on")}
      onClick={() => onChange?.(!checked)}
    >
      <span className="agn-toggle__knob" />
    </button>
  );
}