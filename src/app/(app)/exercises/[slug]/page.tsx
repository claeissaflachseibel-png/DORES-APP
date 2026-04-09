import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UpgradeBanner } from "@/components/upgrade-banner";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getExerciseBySlug } from "@/data/exercises";
import { getRegionBySlug } from "@/data/pain-regions";
import { canViewExercise, type AccessContext } from "@/lib/access/plan-access";
import { getSessionProfile } from "@/lib/profile";
import { MarkCompleteButton } from "./mark-complete";

type Props = { params: Promise<{ slug: string }> };

export default async function ExerciseDetailPage({ params }: Props) {
  const { slug } = await params;
  const exercise = getExerciseBySlug(slug);
  if (!exercise) notFound();

  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (!session.profile.onboarding_completed) redirect("/onboarding");

  const ctx: AccessContext = {
    plan: session.profile.plan,
    primaryRegionSlug: session.profile.primary_region_slug,
    purchasedRegionSlug: session.profile.purchased_region_slug,
  };

  const allowed = canViewExercise(ctx, exercise);
  const region = getRegionBySlug(exercise.regionSlug);

  if (!allowed) {
    return (
      <div className="space-y-8 max-w-2xl">
        <Link href="/exercises" className="text-sm text-primary font-medium">
          ← Voltar ao protocolo
        </Link>
        <Card>
          <h1 className="font-display text-2xl text-foreground">{exercise.title}</h1>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Este exercício faz parte da jornada completa da região{" "}
            <strong>{region?.label}</strong>. No teu plano atual ainda não está
            disponível.
          </p>
          <div className="mt-6">
            <UpgradeBanner variant="region" />
          </div>
          <Link
            href="/plans"
            className={buttonClassName({ className: "mt-4 inline-block" })}
          >
            Ver planos
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <article className="max-w-2xl space-y-8">
      <div>
        <Link href="/exercises" className="text-sm text-primary font-medium">
          ← Protocolo · {region?.label}
        </Link>
        <p className="text-xs text-muted mt-3 uppercase tracking-wide">
          Passo {exercise.order} da jornada
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground mt-1">
          {exercise.title}
        </h1>
      </div>

      <MediaPlaceholder />

      <Card>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Objetivo
        </h2>
        <p className="text-muted mt-2 leading-relaxed">{exercise.objective}</p>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Sobre o exercício
        </h2>
        <p className="text-muted mt-2 leading-relaxed">{exercise.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted">Duração orientadora</dt>
            <dd className="font-medium text-foreground">
              ~{exercise.durationMinutes} min
            </dd>
          </div>
          <div>
            <dt className="text-muted">Volume</dt>
            <dd className="font-medium text-foreground">{exercise.repsOrTime}</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Passo a passo
        </h2>
        <ol className="mt-4 space-y-3 list-decimal list-inside text-muted leading-relaxed">
          {exercise.steps.map((step, i) => (
            <li key={i} className="pl-1">
              <span className="text-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="border-primary/20 bg-accent/40">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Segurança
        </h2>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          {exercise.safetyNotes}
        </p>
      </Card>

      <MarkCompleteButton
        exerciseSlug={exercise.slug}
        regionSlug={exercise.regionSlug}
        defaultPain={session.profile.current_pain_level ?? 5}
        defaultMood={session.profile.last_mood ?? ""}
      />

      {session.profile.plan === "free" && exercise.order === 3 && (
        <UpgradeBanner
          variant="region"
          title="Continua a jornada completa"
          subtitle="Os próximos passos desbloqueiam com o plano da tua região."
        />
      )}
    </article>
  );
}
