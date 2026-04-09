"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { markExerciseComplete } from "@/app/actions/progress";
import {
  updatePainAndMood,
  type QuickLogState,
} from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MOOD_LABELS, type MoodOption } from "@/types";

function ReliefLogForm({
  defaultPain,
  defaultMood,
  onSaved,
}: {
  defaultPain: number;
  defaultMood: string;
  onSaved: () => void;
}) {
  const safeMood = (Object.keys(MOOD_LABELS) as string[]).includes(defaultMood)
    ? defaultMood
    : "";
  const initial: QuickLogState = {};
  const [state, formAction, pending] = useActionState(
    updatePainAndMood,
    initial
  );
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;

  useEffect(() => {
    if (state?.ok) {
      onSavedRef.current();
    }
  }, [state?.ok]);

  return (
    <form action={formAction} className="space-y-4 pt-2">
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Como está a dor agora? (1 = leve · 10 = forte)
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
          htmlFor="relief-mood"
          className="text-sm font-medium text-foreground block mb-2"
        >
          Humor (opcional)
        </label>
        <select
          id="relief-mood"
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
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "A guardar…" : "Registrar alívio"}
      </Button>
    </form>
  );
}

export function MarkCompleteButton({
  exerciseSlug,
  regionSlug,
  defaultPain,
  defaultMood,
}: {
  exerciseSlug: string;
  regionSlug: string;
  defaultPain: number;
  defaultMood: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [showRelief, setShowRelief] = useState(false);
  const [reliefDone, setReliefDone] = useState(false);

  async function onMarkComplete() {
    setPending(true);
    setMsg(null);
    const r = await markExerciseComplete(exerciseSlug, regionSlug);
    setPending(false);
    if (r.error) setMsg(r.error);
    else {
      setMsg("Marcado como feito hoje.");
      setShowRelief(true);
      setReliefDone(false);
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Button
          type="button"
          size="lg"
          className="w-full sm:w-auto"
          onClick={onMarkComplete}
          disabled={pending}
        >
          {pending ? "A guardar…" : "Marcar como feito hoje"}
        </Button>
        {msg && <p className="text-sm text-muted">{msg}</p>}
      </div>

      {showRelief && (
        <Card
          className="border-primary/25 bg-gradient-to-br from-accent/60 to-card"
          padding="lg"
        >
          <h2 className="font-display text-xl text-foreground">
            Momento de alívio
          </h2>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            Pausa breve: notar como o corpo respondeu ajuda a acompanhar a tua
            evolução. Se quiser, regista a dor e o humor agora — ou só respira
            fundo e segue quando estiveres pronta.
          </p>
          {!reliefDone ? (
            <ReliefLogForm
              defaultPain={defaultPain}
              defaultMood={defaultMood}
              onSaved={() => {
                setReliefDone(true);
                router.refresh();
              }}
            />
          ) : (
            <p className="text-sm text-primary font-medium mt-4" role="status">
              Alívio registado. Boa pausa — volta ao protocolo quando quiseres.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
