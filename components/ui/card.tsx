import { type ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  onClick?: () => void;
};

export function Card({ children, className = "", as = "div", onClick }: CardProps) {
  const Component = as;

  return (
    <Component
      onClick={onClick}
      className={[
        "panel",
        onClick ? "cursor-pointer" : "",
        className
      ].join(" ")}
    >
      {children}
    </Component>
  );
}
