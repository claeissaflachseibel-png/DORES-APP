import Link from "next/link";
import { redirect } from "next/navigation";
import { UpgradeBanner } from "@/components/upgrade-banner";
import { ExerciseCard } from "@/components/exercise-card";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getExercisesByRegion } from "@/data/exercises";
import { getRegionBySlug } from "@/data/pain-regions";
import {
  canViewExercise,
  filterExercisesByAccess,
  hideLockedExercisesFromLists,
  planLabel,
  type AccessContext,
} from "@/lib/access/plan-access";
import { hasPainLogToday } from "@/lib/daily-pain-log";
import { getSessionProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { DashboardQuickLog } from "./quick-log";
import { SessionReliefForm } from "./session-relief-form";

export default async function DashboardPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (!session.profile.onboarding_completed) redirect("/onboarding");

  const { profile } = session;
  const primary = profile.primary_region_slug;
  if (!primary) redirect("/onboarding");

  const ctx: AccessContext = {
    plan: profile.plan,
    primaryRegionSlug: profile.primary_region_slug,
    purchasedRegionSlug: profile.purchased_region_slug,
  };

  const regionMeta = getRegionBySlug(primary)!;
  const all = getExercisesByRegion(primary);
  const { visible, locked } = filterExercisesByAccess(ctx, all);
  const hideLocked = hideLockedExercisesFromLists(ctx);
  const exercisesOnDashboard = hideLocked
    ? visible.filter((ex) => canViewExercise(ctx, ex))
    : [...visible, ...locked];

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { count: todayCount } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("completed_on", today);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStr = weekAgo.toISOString().slice(0, 10);
  const { count: weekCount } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .gte("completed_on", weekStr);

  const painLoggedToday = await hasPainLogToday(profile.id);

  const { data: reliefTodayRow } = await supabase
    .from("session_relief_logs")
    .select("relief_score")
    .eq("user_id", profile.id)
    .eq("logged_on", today)
    .maybeSingle();

  const hasSessionToday = (todayCount ?? 0) > 0;
  const reliefLoggedToday = reliefTodayRow != null;
  const reliefDefaultScore = reliefTodayRow?.relief_score ?? 5;

  return (
    <div className="space-y-8">
      <section
        id="checkin-diario"
        className="scroll-mt-6 rounded-2xl border border-primary/25 bg-gradient-to-br from-accent/50 to-card p-5 sm:p-7 shadow-[0_1px_3px_rgba(26,31,28,0.06)]"
      >
        <h2 className="font-display text-xl sm:text-2xl text-foreground">
          Check-in de hoje · dor e humor
        </h2>
        <p className="text-sm text-muted mt-2 leading-relaxed max-w-2xl">
          {painLoggedToday
            ? "Já há registo de hoje — pode ajustar o valor se quiser atualizar."
            : "Todos os dias este passo aparece até registar pelo menos uma vez. Leva segundos."}
        </p>
        <div className="mt-5">
          <DashboardQuickLog
            defaultPain={profile.current_pain_level ?? 5}
            defaultMood={profile.last_mood ?? ""}
            plan={profile.plan}
            suggestionExercises={all
              .filter((ex) => canViewExercise(ctx, ex))
              .map((ex) => ({
                slug: ex.slug,
                title: ex.title,
                order: ex.order,
              }))}
          />
        </div>
      </section>

      <header className="space-y-2">
        <p className="text-sm text-muted">Olá{profile.full_name ? `, ${profile.full_name}` : ""}</p>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight">
          A tua zona hoje: {regionMeta.label}
        </h1>
        <p className="text-muted text-sm max-w-xl">
          Plano {planLabel(profile.plan)} · Sessões curtas, todos os dias que conseguires.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Dor agora
          </p>
          <p className="text-3xl font-semibold text-primary tabular-nums mt-1">
            {profile.current_pain_level ?? "—"}
            <span className="text-base text-muted font-normal"> /10</span>
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Hoje
          </p>
          <p className="text-3xl font-semibold text-foreground tabular-nums mt-1">
            {todayCount ?? 0}
          </p>
          <p className="text-xs text-muted mt-1">exercícios feitos</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            7 dias
          </p>
          <p className="text-3xl font-semibold text-foreground tabular-nums mt-1">
            {weekCount ?? 0}
          </p>
          <p className="text-xs text-muted mt-1">sessões registadas</p>
        </Card>
      </div>

      {profile.plan === "free" && (
        <UpgradeBanner variant="region" />
      )}
      {profile.plan === "single_region" && (
        <UpgradeBanner
          variant="full"
          title="Queres outras regiões?"
          subtitle="O plano completo desbloqueia todo o corpo e o histórico integral."
        />
      )}

      <section>
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-display text-xl text-foreground">Exercícios de hoje</h2>
          <Link href="/exercises" className="text-sm font-medium text-primary hover:underline">
            Ver protocolo
          </Link>
        </div>
        <p className="text-sm text-muted mb-4">
          Segue a ordem sugerida — foi pensada como jornada progressiva.
        </p>
        {hideLocked && (
          <p className="mb-4 rounded-2xl border border-border/80 bg-accent/40 px-4 py-3 text-sm leading-relaxed text-muted">
            <span className="font-medium text-foreground">
              Plano gratuito:
            </span>{" "}
            tens acesso a <strong className="text-foreground">3 exercícios</strong>{" "}
            da tua região. Para o protocolo completo, vê{" "}
            <Link href="/plans" className="font-medium text-primary hover:underline">
              Planos
            </Link>
            .
          </p>
        )}
        <ul className="space-y-3">
          {exercisesOnDashboard.map((ex) => {
            const open = canViewExercise(ctx, ex);
            return (
              <li key={ex.slug}>
                <ExerciseCard
                  exercise={ex}
                  locked={!open}
                  index={ex.order}
                />
              </li>
            );
          })}
        </ul>
        {!hideLocked && locked.length > 0 && (
          <p className="mt-4 text-center text-sm text-muted">
            +{locked.length} exercícios disponíveis ao desbloquear esta região.
          </p>
        )}
        {hideLocked && (
          <p className="mt-4 text-center text-sm text-muted">
            Protocolo completo e mais regiões em{" "}
            <Link href="/plans" className="font-medium text-primary hover:underline">
              Planos
            </Link>
            .
          </p>
        )}
      </section>

      <SessionReliefForm
        defaultScore={reliefDefaultScore}
        hasSessionToday={hasSessionToday}
        initialLogged={reliefLoggedToday}
      />

      {profile.plan === "free" && (
        <div className="text-center pb-4">
          <Link
            href="/plans"
            className={buttonClassName({
              variant: "secondary",
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            Desbloquear mais exercícios
          </Link>
        </div>
      )}
    </div>
  );
}
