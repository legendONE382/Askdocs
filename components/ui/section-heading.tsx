import { type ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
};

export function SectionHeading({ children, level = 2, className = "" }: SectionHeadingProps) {
  const base = "font-semibold tracking-tight text-slate-50";

  const sizes = {
    1: "text-3xl sm:text-4xl lg:text-5xl",
    2: "text-2xl sm:text-3xl",
    3: "text-xl sm:text-2xl"
  };

  const Component = level === 1 ? "h1" : level === 2 ? "h2" : "h3";

  return (
    <Component className={`${base} ${sizes[level]} ${className}`}>
      {children}
    </Component>
  );
}
