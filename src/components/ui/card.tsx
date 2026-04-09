import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  padding = "md",
}: {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}) {
  const p: Record<"none" | "sm" | "md" | "lg", string> = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };
  return (
    <div
      className={`rounded-2xl sm:rounded-3xl bg-card border border-border/80 shadow-[0_1px_3px_rgba(26,31,28,0.06)] ${p[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
