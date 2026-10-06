import { type ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
};

export function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  className = ""
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition disabled:opacity-70 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-accent text-slate-950 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent",
    secondary:
      "border border-slate-600 text-slate-100 hover:border-slate-400 hover:bg-slate-800/50",
    ghost:
      "text-slate-300 hover:text-slate-100 hover:bg-slate-800/50",
    danger:
      "border border-rose-500/60 text-rose-200 hover:border-rose-400 hover:bg-rose-950/40"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes.md} ${className}`}
    >
      {children}
    </button>
  );
}
