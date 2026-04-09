"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatMmSs(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

type Mode = "stopwatch" | "countdown";

export function ExerciseTimer({ suggestedMinutes }: { suggestedMinutes: number }) {
  const safeMinutes = Math.max(1, Math.round(suggestedMinutes) || 1);
  const initialCountdownSec = safeMinutes * 60;

  const [mode, setMode] = useState<Mode>("stopwatch");
  const [running, setRunning] = useState(false);
  /** Segundos decorridos (cronômetro) */
  const [elapsedSec, setElapsedSec] = useState(0);
  /** Segundos restantes (regressiva) */
  const [leftSec, setLeftSec] = useState(initialCountdownSec);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (mode === "stopwatch") {
        setElapsedSec((n) => n + 1);
        return;
      }
      setLeftSec((prev) => {
        if (prev <= 1) {
          setRunning(false);
          setFinished(true);
          if (typeof window !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate(200);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const switchMode = (next: Mode) => {
    setRunning(false);
    setMode(next);
    setFinished(false);
    if (next === "stopwatch") setElapsedSec(0);
    else setLeftSec(initialCountdownSec);
  };

  const reset = () => {
    setRunning(false);
    setFinished(false);
    if (mode === "stopwatch") setElapsedSec(0);
    else setLeftSec(initialCountdownSec);
  };

  const displaySec = mode === "stopwatch" ? elapsedSec : leftSec;
  const label =
    mode === "stopwatch"
      ? "Cronômetro"
      : `Regressiva (~${safeMinutes} min sugeridos)`;

  return (
    <Card className="border-primary/20 bg-accent/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Tempo
          </h2>
          <p className="mt-1 text-xs text-muted">
            Use o cronômetro livre ou a regressiva com a duração orientadora do
            exercício.
          </p>
        </div>
        <div
          className="flex rounded-xl border border-border bg-card p-0.5 text-xs font-medium"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "stopwatch"}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              mode === "stopwatch"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => switchMode("stopwatch")}
          >
            Cronômetro
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "countdown"}
            className={`rounded-lg px-3 py-1.5 transition-colors ${
              mode === "countdown"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => switchMode("countdown")}
          >
            Regressiva
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">{label}</p>

      <div
        className="mt-4 flex flex-col items-center gap-1"
        aria-live={finished ? "polite" : "off"}
      >
        <span
          className="font-display text-5xl tabular-nums tracking-tight text-foreground sm:text-6xl"
          aria-label={`Tempo ${formatMmSs(displaySec)}`}
        >
          {formatMmSs(displaySec)}
        </span>
        {finished && mode === "countdown" && (
          <span className="text-sm font-medium text-primary">
            Tempo sugerido concluído
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          onClick={() => {
            setFinished(false);
            setRunning((r) => !r);
          }}
        >
          {running ? "Pausar" : "Iniciar"}
        </Button>
        <Button type="button" variant="outline" onClick={reset}>
          Zerar
        </Button>
      </div>
    </Card>
  );
}
