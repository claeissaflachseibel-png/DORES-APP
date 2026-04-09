"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import {
  upsertSessionRelief,
  type SessionReliefState,
} from "@/app/actions/session-relief";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SessionReliefForm({
  defaultScore,
  hasSessionToday,
  initialLogged,
}: {
  defaultScore: number;
  hasSessionToday: boolean;
  initialLogged: boolean;
}) {
  const initial: SessionReliefState = {};
  const [state, formAction, pending] = useActionState(
    upsertSessionRelief,
    initial
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
    }
  }, [state?.ok, router]);

  if (!hasSessionToday) {
    return (
      <Card className="border-border/80 bg-card/60" padding="lg">
        <h2 className="font-display text-lg text-foreground">
          Alívio após a sessão
        </h2>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          Quando concluíres pelo menos um exercício hoje, podes indicar o quanto
          a dor aliviou — isso alimenta os gráficos em{" "}
          <strong className="text-foreground">Progresso</strong>.
        </p>
      </Card>
    );
  }

  return (
    <Card
      className="border-primary/25 bg-gradient-to-br from-accent/40 to-card"
      padding="lg"
    >
      <h2 className="font-display text-lg text-foreground">
        Após a sessão de hoje
      </h2>
      <p className="text-sm text-muted mt-2 leading-relaxed max-w-2xl">
        {initialLogged
          ? "Já tens um registo — podes ajustar se quiseres."
          : "Quanto sentiste que a dor aliviou depois do que fizeste hoje? (1 = quase nada · 10 = muito alívio)"}
      </p>
      <form action={formAction} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="relief_score"
            className="text-sm font-medium text-foreground block mb-2"
          >
            Alívio percebido
          </label>
          <input
            id="relief_score"
            type="range"
            name="relief_score"
            min={1}
            max={10}
            defaultValue={defaultScore}
            className="w-full accent-primary"
          />
          <p className="text-xs text-muted mt-1">
            1 = pouco alívio · 10 = muito alívio
          </p>
        </div>
        {state?.error && (
          <p className="text-sm text-danger">{state.error}</p>
        )}
        {state?.ok && (
          <p className="text-sm text-primary">Registo guardado.</p>
        )}
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "A guardar…" : "Guardar alívio do dia"}
        </Button>
      </form>
    </Card>
  );
}
