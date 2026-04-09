import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { ExerciseDef } from "@/types";

export function ExerciseCard({
  exercise,
  locked,
  index,
}: {
  exercise: ExerciseDef;
  locked: boolean;
  index: number;
}) {
  const content = (
    <Card
      padding="md"
      className={`transition-all ${
        locked
          ? "opacity-75 border-dashed"
          : "hover:border-primary/25 hover:shadow-md"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold ${
            locked ? "bg-border text-muted" : "bg-accent text-primary"
          }`}
          aria-hidden
        >
          {index}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-foreground leading-snug">
              {exercise.title}
            </h3>
            {locked && (
              <span className="shrink-0 text-xs font-medium text-muted bg-border/60 px-2 py-0.5 rounded-lg">
                Bloqueado
              </span>
            )}
          </div>
          <p className="text-sm text-muted mt-1 line-clamp-2">
            {exercise.description}
          </p>
          <p className="text-xs text-muted mt-2">
            {exercise.durationMinutes} min · {exercise.repsOrTime}
          </p>
        </div>
      </div>
    </Card>
  );

  if (locked) {
    return <div className="block">{content}</div>;
  }

  return (
    <Link href={`/exercises/${exercise.slug}`} className="block">
      {content}
    </Link>
  );
}
