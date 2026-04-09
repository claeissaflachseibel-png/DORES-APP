import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-sm active:scale-[0.98]",
  secondary:
    "bg-accent text-foreground hover:bg-[#dce8df] active:scale-[0.98]",
  ghost: "text-muted hover:bg-accent/80 hover:text-foreground",
  outline:
    "border border-border bg-card text-foreground hover:bg-accent/50 active:scale-[0.98]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm rounded-xl",
  md: "min-h-12 px-6 text-base rounded-2xl",
  lg: "min-h-14 px-8 text-lg rounded-2xl",
};

/** Usar em `<Link className={buttonClassName({...})}>` — nunca `<a><button>`. */
export function buttonClassName({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  return `inline-flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`.trim();
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
