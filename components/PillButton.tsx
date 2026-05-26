"use client";

import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  showStars?: boolean;
};

export default function PillButton({
  children,
  variant = "primary",
  showStars = true,
  className = "",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 h-12 text-sm font-medium transition active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? "bg-ink text-paper border border-ink"
      : "bg-paper text-ink border-[1.5px] border-ink";

  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {showStars && <span className="text-gold text-base leading-none">★</span>}
      <span>{children}</span>
      {showStars && <span className="text-gold text-base leading-none">★</span>}
    </button>
  );
}
