import { PAIN_REGIONS } from "@/data/pain-regions";
import { getExercisesByRegion } from "@/data/exercises";
import type { ExerciseDef, PainRegionSlug, PlanTier } from "@/types";

export interface AccessContext {
  plan: PlanTier;
  /** Região escolhida no onboarding (sempre relevante no free) */
  primaryRegionSlug: PainRegionSlug | null;
  /** Região comprada no plano região única */
  purchasedRegionSlug: PainRegionSlug | null;
}

export function canAccessRegion(
  ctx: AccessContext,
  regionSlug: PainRegionSlug
): boolean {
  if (ctx.plan === "full") return true;
  if (ctx.plan === "single_region") {
    return ctx.purchasedRegionSlug === regionSlug;
  }
  /* free */
  return ctx.primaryRegionSlug === regionSlug;
}

/**
 * Quantos exercícios da região o utilizador pode ver (ordenados por `order`).
 */
export function visibleExerciseCountForRegion(ctx: AccessContext): number {
  if (ctx.plan === "free") return 3;
  return Number.POSITIVE_INFINITY;
}

export function canViewExercise(
  ctx: AccessContext,
  exercise: Pick<ExerciseDef, "regionSlug" | "order">
): boolean {
  if (!canAccessRegion(ctx, exercise.regionSlug)) return false;
  const limit = visibleExerciseCountForRegion(ctx);
  if (limit === Number.POSITIVE_INFINITY) return true;
  return exercise.order <= limit;
}

export function filterExercisesByAccess(
  ctx: AccessContext,
  exercises: ExerciseDef[]
): { visible: ExerciseDef[]; locked: ExerciseDef[] } {
  const visible: ExerciseDef[] = [];
  const locked: ExerciseDef[] = [];
  for (const ex of exercises) {
    if (canViewExercise(ctx, ex)) visible.push(ex);
    else locked.push(ex);
  }
  return { visible, locked };
}

export function planLabel(plan: PlanTier): string {
  switch (plan) {
    case "free":
      return "Gratuito";
    case "single_region":
      return "Região única";
    case "full":
      return "Completo";
    default:
      return plan;
  }
}

export function regionExerciseSections(ctx: AccessContext) {
  return PAIN_REGIONS.map((region) => {
    const all = getExercisesByRegion(region.slug);
    if (!canAccessRegion(ctx, region.slug)) {
      return {
        region,
        regionLocked: true as const,
        visible: [] as ExerciseDef[],
        locked: all,
      };
    }
    const { visible, locked } = filterExercisesByAccess(ctx, all);
    return {
      region,
      regionLocked: false as const,
      visible,
      locked,
    };
  });
}
