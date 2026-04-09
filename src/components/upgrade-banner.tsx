import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function UpgradeBanner({
  title,
  subtitle,
  variant = "region",
}: {
  title?: string;
  subtitle?: string;
  variant?: "region" | "full" | "generic";
}) {
  const copy =
    variant === "full"
      ? {
          t: title ?? "Desbloqueie todas as regiões",
          s:
            subtitle ??
            "Jornadas completas, histórico ilimitado e progresso em todo o corpo.",
          href: "/plans",
          cta: "Ver plano completo",
        }
      : variant === "region"
        ? {
            t: title ?? "Desbloqueie a sua região",
            s:
              subtitle ??
              "Acesso total aos exercícios desta zona e ao histórico completo.",
            href: "/plans",
            cta: "Desbloquear região",
          }
        : {
            t: title ?? "Faça upgrade do seu plano",
            s: subtitle ?? "Mais exercícios e regiões quando precisar.",
            href: "/plans",
            cta: "Comparar planos",
          };

  return (
    <Card className="bg-gradient-to-br from-accent/80 to-card border-primary/15">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-display text-lg text-foreground">{copy.t}</p>
          <p className="text-sm text-muted mt-1 max-w-md">{copy.s}</p>
        </div>
        <Link
          href={copy.href}
          className={buttonClassName({
            size: "md",
            className: "w-full shrink-0 sm:w-auto",
          })}
        >
          {copy.cta}
        </Link>
      </div>
    </Card>
  );
}
