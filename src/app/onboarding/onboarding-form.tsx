"use client";

import { useState } from "react";
import Link from "next/link";
import { completeOnboarding } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAIN_REGIONS } from "@/data/pain-regions";
import {
  MOOD_LABELS,
  PAIN_FREQUENCY_OPTIONS,
  type MoodOption,
  type PainRegionSlug,
} from "@/types";

const STEPS = ["Região", "Dor", "Rotina", "Humor"] as const;

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState<PainRegionSlug | "">("");
  const [painLevel, setPainLevel] = useState(5);
  const [frequency, setFrequency] = useState("");
  const [mood, setMood] = useState<MoodOption | "">("");
  const [routine, setRoutine] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function next() {
    setError(null);
    if (step === 0 && !region) {
      setError("Escolhe uma região.");
      return;
    }
    if (step === 2 && !frequency) {
      setError("Indica a frequência da dor.");
      return;
    }
    if (step === 3 && !mood) {
      setError("Como te sentes hoje?");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!region || !mood) {
      setError("Preenche todos os passos.");
      return;
    }
    setPending(true);
    const fd = new FormData();
    fd.set("region", region);
    fd.set("pain_level", String(painLevel));
    fd.set("frequency", frequency);
    fd.set("mood", mood);
    fd.set("routine", routine);
    try {
      await completeOnboarding(fd);
    } catch (err) {
      setPending(false);
      setError(err instanceof Error ? err.message : "Algo correu mal.");
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-8 gap-2">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`flex-1 text-center text-xs font-medium rounded-full py-2 px-1 sm:px-2 ${
              i === step
                ? "bg-primary text-white"
                : i < step
                  ? "bg-accent text-primary"
                  : "bg-border/50 text-muted"
            }`}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{i + 1}</span>
          </div>
        ))}
      </div>

      <Card padding="lg">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground mb-6 inline-block"
        >
          ← Sair (marca Dores+)
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 0 && (
            <div>
              <h1 className="font-display text-2xl text-foreground">
                Onde sentes mais desconforto?
              </h1>
              <p className="text-sm text-muted mt-2">
                No plano gratuito, focamo-nos nesta região. Podes desbloquear mais
                depois.
              </p>
              <div className="mt-6 grid gap-2">
                {PAIN_REGIONS.map((r) => (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => setRegion(r.slug)}
                    className={`text-left rounded-2xl border px-4 py-4 min-h-[56px] transition-all ${
                      region === r.slug
                        ? "border-primary bg-accent ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span className="font-medium text-foreground">{r.label}</span>
                    <span className="block text-xs text-muted mt-0.5">
                      {r.shortLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="font-display text-2xl text-foreground">
                Intensidade hoje
              </h1>
              <p className="text-sm text-muted mt-2">Escala de 1 (leve) a 10 (máxima).</p>
              <div className="mt-8">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-primary h-3"
                />
                <div className="flex justify-between text-sm text-muted mt-2">
                  <span>1</span>
                  <span className="text-2xl font-semibold text-primary tabular-nums">
                    {painLevel}
                  </span>
                  <span>10</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-display text-2xl text-foreground">
                Com que frequência?
              </h1>
              <p className="text-sm text-muted mt-2">Ajuda-nos a calibrar a tua jornada.</p>
              <div className="mt-6 grid gap-2">
                {PAIN_FREQUENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFrequency(opt.value)}
                    className={`text-left rounded-2xl border px-4 py-4 min-h-[52px] ${
                      frequency === opt.value
                        ? "border-primary bg-accent ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <label className="block mt-6 text-sm font-medium text-foreground">
                Nota sobre a tua rotina (opcional)
                <textarea
                  name="routine_display"
                  value={routine}
                  onChange={(e) => setRoutine(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Ex.: muitas horas ao computador, ginásio 3x/semana…"
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="font-display text-2xl text-foreground">
                Como está o teu humor?
              </h1>
              <p className="text-sm text-muted mt-2">Um instantâneo de hoje — podes atualizar depois.</p>
              <div className="mt-6 grid gap-2">
                {(Object.keys(MOOD_LABELS) as MoodOption[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`text-left rounded-2xl border px-4 py-4 min-h-[52px] ${
                      mood === m
                        ? "border-primary bg-accent ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    {MOOD_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            {step > 0 && (
              <Button type="button" variant="outline" className="flex-1" onClick={back}>
                Voltar
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button type="button" className="flex-1" onClick={next}>
                Continuar
              </Button>
            ) : (
              <Button type="submit" className="flex-1" disabled={pending}>
                {pending ? "A guardar…" : "Começar jornada"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
