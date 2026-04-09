import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full min-h-12 rounded-2xl border border-border bg-card px-4 text-base text-foreground placeholder:text-muted/70 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${className}`}
      {...props}
    />
  );
}
