import { type ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "info";
  className?: string;
};

const tones = {
  default: "border-slate-600 bg-slate-800/60 text-slate-200",
  success: "border-emerald-500/40 bg-emerald-950/40 text-emerald-200",
  warning: "border-amber-500/40 bg-amber-950/40 text-amber-200",
  info: "border-accent/30 bg-accent-soft text-accent"
};

export function Badge({ children, tone = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      ].join(" ")}
    >
      {children}
    </span>
  );
}
