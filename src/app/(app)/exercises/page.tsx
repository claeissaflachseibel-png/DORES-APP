import Link from "next/link";
import { redirect } from "next/navigation";
import { UpgradeBanner } from "@/components/upgrade-banner";
import { ExerciseCard } from "@/components/exercise-card";
import { Card } from "@/components/ui/card";
import {
  canViewExercise,
  hideLockedExercisesFromLists,
  regionExerciseSections,
} from "@/lib/access/plan-access";
import type { AccessContext } from "@/lib/access/plan-access";
import { getSessionProfile } from "@/lib/profile";

export default async function ExercisesPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (!session.profile.onboarding_completed) redirect("/onboarding");

  const { profile } = session;
  const ctx: AccessContext = {
    plan: profile.plan,
    primaryRegionSlug: profile.primary_region_slug,
    purchasedRegionSlug: profile.purchased_region_slug,
  };

  const sections = regionExerciseSections(ctx);
  const hideLocked = hideLockedExercisesFromLists(ctx);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground">
          Protocolos por região
        </h1>
        <p className="text-muted mt-2 max-w-2xl text-sm sm:text-base">
          {hideLocked ? (
            <>
              Vês apenas os exercícios incluídos no plano gratuito. O protocolo
              completo fica disponível ao fazeres upgrade em{" "}
              <Link href="/plans" className="font-medium text-primary hover:underline">
                Planos
              </Link>
              .
            </>
          ) : (
            <>
              Cada lista segue uma ordem clínica simples: mobilidade, controlo e
              progressão suave. Exercícios bloqueados mostram o que desbloqueias com
              o upgrade.
            </>
          )}
        </p>
      </header>

      {hideLocked && <UpgradeBanner variant="region" />}
      {profile.plan === "single_region" && (
        <UpgradeBanner
          variant="full"
          title="Outras regiões no plano completo"
          subtitle="Mantém o foco na região que compraste ou faz upgrade para tudo."
        />
      )}

      <div className="space-y-12">
        {sections.map(
          ({ region, regionLocked, visible, locked }) => (
            <section key={region.slug}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-display text-xl text-foreground">
                    {region.label}
                  </h2>
                  <p className="text-sm text-muted">{region.shortLabel}</p>
                </div>
                {regionLocked && (
                  <Link
                    href="/plans"
                    className="text-sm font-medium text-primary hover:underline shrink-0"
                  >
                    Desbloquear região →
                  </Link>
                )}
              </div>

              {regionLocked ? (
                <Card className="border-dashed bg-accent/30">
                  <p className="text-sm text-muted">
                    Esta região faz parte do plano completo ou de um desbloqueio
                    específico. Compara opções em{" "}
                    <Link href="/plans" className="text-primary font-medium">
                      Planos
                    </Link>
                    .
                  </p>
                  <p className="text-xs text-muted mt-2">
                    {hideLocked
                      ? "Protocolo completo disponível com upgrade."
                      : `${locked.length} exercícios no protocolo completo.`}
                  </p>
                </Card>
              ) : (
                <ul className="space-y-3">
                  {(hideLocked
                    ? visible.filter((ex) => canViewExercise(ctx, ex))
                    : [...visible, ...locked]
                  ).map((ex) => {
                    const isLocked =
                      !hideLocked && locked.some((l) => l.slug === ex.slug);
                    return (
                      <li key={ex.slug}>
                        <ExerciseCard
                          exercise={ex}
                          locked={isLocked}
                          index={ex.order}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )
        )}
      </div>
    </div>
  );
}
