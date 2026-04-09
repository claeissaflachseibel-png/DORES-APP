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
          ? "border-dashed opacity-90"
          : "hover:border-primary/25 hover:shadow-md"
      }`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold ${
            locked ? "bg-border text-muted" : "bg-accent text-primary"
          }`}
          aria-hidden
        >
          {index}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <h3 className="min-w-0 font-medium leading-snug text-foreground">
              {exercise.title}
            </h3>
            {locked ? (
              <Link
                href="/plans"
                className="shrink-0 text-sm font-semibold text-primary hover:underline"
              >
                Desbloquear
              </Link>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {exercise.description}
          </p>
          <p className="mt-2 text-xs text-muted">
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
