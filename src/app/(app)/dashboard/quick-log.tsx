"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import {
  updatePainAndMood,
  type QuickLogState,
} from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  buildTrainingSuggestion,
  isPaidPlan,
  type ExerciseMini,
  type TrainingSuggestionResult,
} from "@/lib/training-suggestion";
import { MOOD_LABELS, type MoodOption, type PlanTier } from "@/types";
import { PostCheckinSuggestion } from "./post-checkin-suggestion";

export function DashboardQuickLog({
  defaultPain,
  defaultMood,
  plan,
  suggestionExercises,
}: {
  defaultPain: number;
  defaultMood: string;
  plan: PlanTier;
  suggestionExercises: ExerciseMini[];
}) {
  const safeMood = (Object.keys(MOOD_LABELS) as string[]).includes(defaultMood)
    ? defaultMood
    : "";
  const initial: QuickLogState = {};
  const [state, formAction, pending] = useActionState(
    updatePainAndMood,
    initial
  );
  const router = useRouter();
  const suggestionSnap = useRef<{
    painLevel: number;
    moodLabel: string | null;
    suggestion: TrainingSuggestionResult;
  } | null>(null);

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
    }
  }, [state?.ok, router]);

  useEffect(() => {
    if (
      state?.ok &&
      isPaidPlan(plan) &&
      state.painLevel != null
    ) {
      const moodLabel =
        state.mood && state.mood in MOOD_LABELS
          ? MOOD_LABELS[state.mood as MoodOption]
          : null;
      suggestionSnap.current = {
        painLevel: state.painLevel,
        moodLabel,
        suggestion: buildTrainingSuggestion(
          state.painLevel,
          state.mood,
          suggestionExercises
        ),
      };
    }
  }, [state?.ok, state?.painLevel, state?.mood, plan, suggestionExercises]);

  const showPaidSuggestion =
    isPaidPlan(plan) && suggestionSnap.current != null;

  return (
    <div className="space-y-4">
      <Card>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Nível de dor (1–10)
            </label>
            <input
              type="range"
              name="pain_level"
              min={1}
              max={10}
              defaultValue={defaultPain}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <label
              htmlFor="mood"
              className="text-sm font-medium text-foreground block mb-2"
            >
              Humor
            </label>
            <select
              id="mood"
              name="mood"
              defaultValue={safeMood}
              className="w-full min-h-12 rounded-2xl border border-border bg-card px-4 text-base outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Manter sem alterar</option>
              {(Object.keys(MOOD_LABELS) as MoodOption[]).map((m) => (
                <option key={m} value={m}>
                  {MOOD_LABELS[m]}
                </option>
              ))}
            </select>
          </div>
          {state?.error && (
            <p className="text-sm text-danger">{state.error}</p>
          )}
          {state?.ok && (
            <p className="text-sm text-primary">Registado com sucesso.</p>
          )}
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "A guardar…" : "Guardar registo"}
          </Button>
        </form>
      </Card>
      {showPaidSuggestion && suggestionSnap.current ? (
        <PostCheckinSuggestion
          suggestion={suggestionSnap.current.suggestion}
          painLevel={suggestionSnap.current.painLevel}
          moodLabel={suggestionSnap.current.moodLabel}
        />
      ) : null}
    </div>
  );
}
