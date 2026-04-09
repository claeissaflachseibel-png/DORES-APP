import type { PlanTier } from "@/types";

export type ExerciseMini = { slug: string; title: string; order: number };

export type TrainingSuggestionResult = {
  headline: string;
  detail: string;
  picks: { slug: string; title: string }[];
  tag: "recuperação" | "equilíbrio" | "progressão";
};

export function isPaidPlan(plan: PlanTier): boolean {
  return plan === "single_region" || plan === "full";
}

/**
 * Sugestão simples após check-in (dor + humor), só para copy na UI.
 * Planos pagos têm protocolo completo na região (ou em todo o corpo).
 */
export function buildTrainingSuggestion(
  painLevel: number,
  mood: string | undefined,
  exercises: ExerciseMini[]
): TrainingSuggestionResult {
  const sorted = [...exercises].sort((a, b) => a.order - b.order);
  if (sorted.length === 0) {
    return {
      headline: "Ver o protocolo",
      detail:
        "Quando tiver exercícios disponíveis na tua região, sugerimos seguir a ordem da jornada.",
      picks: [],
      tag: "equilíbrio",
    };
  }

  const lowMood = mood === "muito_baixo" || mood === "baixo";
  const highMood = mood === "bom" || mood === "muito_bom";

  let cap = sorted.length;
  let tag: TrainingSuggestionResult["tag"] = "equilíbrio";
  let headline = "";
  let detail = "";

  if (painLevel >= 8) {
    cap = Math.min(2, sorted.length);
    tag = "recuperação";
    headline = "Sessão muito leve";
    detail =
      "Dor alta hoje: faz só os primeiros exercícios, devagar e sem forçar amplitude. Melhor parar do que piorar.";
  } else if (painLevel >= 5) {
    cap = Math.min(4, sorted.length);
    tag = "equilíbrio";
    headline = "Sessão moderada";
    detail =
      "Ritmo confortável; interrompe se a dor subir. Prioriza qualidade ao volume.";
  } else {
    cap = sorted.length;
    tag = highMood ? "progressão" : "equilíbrio";
    headline = "Bom momento para o protocolo";
    detail = highMood
      ? "Humor positivo — bom dia para consolidar hábitos com calma."
      : "Segue a ordem sugerida e adapta o esforço ao que sentires.";
  }

  if (lowMood) {
    cap = Math.min(cap, 3);
    detail = `Humor em baixo: sessão curta. ${detail}`;
  }

  const picked = sorted.slice(0, Math.max(1, Math.min(cap, sorted.length)));
  return {
    headline,
    detail: detail.trim(),
    picks: picked.map((e) => ({ slug: e.slug, title: e.title })),
    tag,
  };
}
