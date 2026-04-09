"use client";

import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TrainingSuggestionResult } from "@/lib/training-suggestion";

const tagLabel: Record<TrainingSuggestionResult["tag"], string> = {
  recuperação: "Recuperação",
  equilíbrio: "Equilíbrio",
  progressão: "Progressão",
};

export function PostCheckinSuggestion({
  suggestion,
  painLevel,
  moodLabel,
}: {
  suggestion: TrainingSuggestionResult;
  painLevel: number;
  moodLabel: string | null;
}) {
  return (
    <Card className="border-primary/30 bg-primary/5" padding="lg">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Sugestão de treino (plano pago)
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <h3 className="font-display text-lg text-foreground">
          {suggestion.headline}
        </h3>
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-foreground">
          {tagLabel[suggestion.tag]}
        </span>
      </div>
      <p className="text-sm text-muted mt-2 leading-relaxed">
        {suggestion.detail}
      </p>
      <p className="text-xs text-muted mt-3">
        Com base no registo de hoje: dor {painLevel}/10
        {moodLabel ? ` · humor: ${moodLabel}` : ""}.
      </p>
      {suggestion.picks.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {suggestion.picks.map((ex, i) => (
            <li key={ex.slug}>
              <Link
                href={`/exercises/${ex.slug}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {i + 1}. {ex.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Link
          href="/exercises"
          className={buttonClassName({
            size: "sm",
            className: "mt-4 inline-block",
          })}
        >
          Ver protocolo completo
        </Link>
      )}
      <Link
        href="/exercises"
        className="mt-3 block text-xs text-muted hover:text-primary hover:underline"
      >
        Ir para todos os exercícios da região
      </Link>
    </Card>
  );
}
