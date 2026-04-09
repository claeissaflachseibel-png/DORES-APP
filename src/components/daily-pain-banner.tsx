import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";

/** Lembrete global até existir registo de dor no dia (UTC). */
export function DailyPainBanner() {
  return (
    <div
      className="mb-6 rounded-2xl border border-primary/35 bg-primary/8 px-4 py-3 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      role="status"
    >
      <p className="text-sm text-foreground leading-snug">
        <span className="font-semibold">Check-in do dia:</span> como está a sua
        dor hoje? Um registo rápido ajuda a acompanhar a evolução.
      </p>
      <Link
        href="/dashboard#checkin-diario"
        className={buttonClassName({
          size: "sm",
          className: "shrink-0 w-full sm:w-auto text-center",
        })}
      >
        Responder agora
      </Link>
    </div>
  );
}
