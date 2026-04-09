import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { MOOD_LABELS, type MoodOption } from "@/types";
import { computeUsageStreak } from "@/lib/streak";
import { getSessionProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

function moodBar(label: string) {
  const keys = Object.keys(MOOD_LABELS) as MoodOption[];
  const idx = keys.indexOf(label as MoodOption);
  const pct =
    idx >= 0 ? Math.round(((idx + 1) / keys.length) * 100) : 20;
  return pct;
}

export default async function ProgressPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (!session.profile.onboarding_completed) redirect("/onboarding");

  const supabase = await createClient();
  const userId = session.profile.id;

  const { data: painLogs } = await supabase
    .from("user_pain_logs")
    .select("level, logged_at")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false })
    .limit(14);

  const { data: moodLogs } = await supabase
    .from("user_mood_logs")
    .select("mood_label, logged_at")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false })
    .limit(14);

  const { data: progressRows } = await supabase
    .from("user_progress")
    .select("completed_on")
    .eq("user_id", userId);

  const { data: reliefLogs, error: reliefLogsError } = await supabase
    .from("session_relief_logs")
    .select("relief_score, logged_on")
    .eq("user_id", userId)
    .order("logged_on", { ascending: false })
    .limit(21);

  const completionDates = (progressRows ?? []).map((r) => r.completed_on as string);
  const distinctDays = [...new Set(completionDates)].length;
  const streak = computeUsageStreak(completionDates);

  const painChart = [...(painLogs ?? [])].reverse();
  const reliefChart = !reliefLogsError && reliefLogs
    ? [...reliefLogs].reverse()
    : [];
  const maxPain = 10;
  const maxRelief = 10;

  const painByDay = new Map<string, number>();
  for (const p of [...(painLogs ?? [])].reverse()) {
    const d = new Date(p.logged_at as string).toISOString().slice(0, 10);
    painByDay.set(d, p.level);
  }
  const reliefByDay = new Map<string, number>();
  for (const r of reliefChart) {
    reliefByDay.set(String(r.logged_on), r.relief_score);
  }

  const comparisonDays: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const t = new Date();
    t.setUTCDate(t.getUTCDate() - i);
    comparisonDays.push(t.toISOString().slice(0, 10));
  }

  const reliefMissingTable =
    reliefLogsError &&
    (String(reliefLogsError.message).toLowerCase().includes("relation") ||
      String(reliefLogsError.message).toLowerCase().includes("schema") ||
      String(reliefLogsError.message).toLowerCase().includes("does not exist"));

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground">
          Progresso
        </h1>
        <p className="text-muted mt-2 text-sm max-w-xl">
          Histórico simples para perceberes padrões — sem sobrecarregar com dados.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-xs font-medium text-muted uppercase">Dias com sessão</p>
          <p className="text-3xl font-semibold text-primary tabular-nums mt-1">
            {distinctDays}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-muted uppercase">Sequência</p>
          <p className="text-3xl font-semibold text-foreground tabular-nums mt-1">
            {streak}
          </p>
          <p className="text-xs text-muted mt-1">dias seguidos</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-muted uppercase">Check-ins de dor</p>
          <p className="text-3xl font-semibold text-foreground tabular-nums mt-1">
            {painLogs?.length ?? 0}
          </p>
          <p className="text-xs text-muted mt-1">últimas entradas</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-muted uppercase">Alívio pós-sessão</p>
          <p className="text-3xl font-semibold text-foreground tabular-nums mt-1">
            {reliefChart.length}
          </p>
          <p className="text-xs text-muted mt-1">dias com registo</p>
        </Card>
      </div>

      <section>
        <h2 className="font-display text-xl text-foreground mb-4">
          Dor (últimos registos)
        </h2>
        <Card padding="lg">
          {painChart.length === 0 ? (
            <p className="text-sm text-muted">
              Ainda não há histórico. Regista na área{" "}
              <Link href="/dashboard" className="text-primary font-medium">
                Início
              </Link>
              .
            </p>
          ) : (
            <div
              className="flex min-h-[168px] flex-wrap items-end justify-center gap-3 sm:gap-4"
              role="img"
              aria-label="Gráfico de níveis de dor"
            >
              {painChart.map((p, i) => {
                const h = Math.round((p.level / maxPain) * 120);
                return (
                  <div
                    key={`${p.logged_at}-${i}`}
                    className="flex h-[148px] w-11 shrink-0 flex-col items-center justify-end gap-1.5 sm:w-12"
                  >
                    <div
                      className="w-full min-h-2 rounded-t-lg bg-primary shadow-sm transition-all"
                      style={{ height: `${Math.max(h, 8)}px` }}
                      title={`${p.level}/10`}
                    />
                    <span className="w-full text-center text-[10px] font-medium text-muted tabular-nums">
                      {String(p.logged_at).slice(5, 10)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl text-foreground mb-2">
          Alívio após a sessão
        </h2>
        <p className="text-sm text-muted mb-4 max-w-2xl">
          Depois de treinares, regista no{" "}
          <Link href="/dashboard" className="text-primary font-medium">
            Início
          </Link>{" "}
          o quanto a dor aliviou (1–10). Barras mais altas = mais alívio
          sentido nesse dia.
        </p>
        <Card padding="lg">
          {reliefMissingTable ? (
            <div className="space-y-3 rounded-xl border border-border bg-accent/40 px-4 py-3 text-sm leading-relaxed text-muted">
              <p>
                Falta criar a tabela de alívio no Supabase. Abre{" "}
                <strong className="text-foreground">SQL Editor</strong> no teu
                projeto, cola o conteúdo de{" "}
                <code className="rounded bg-card px-1.5 py-0.5 text-xs text-foreground">
                  supabase/migrations/002_session_relief_logs.sql
                </code>{" "}
                e corre <strong className="text-foreground">Run</strong>.
              </p>
              <p className="text-xs">
                (No Cursor: abre esse ficheiro na pasta do projeto, copia tudo,
                cola no SQL Editor e executa uma vez.)
              </p>
            </div>
          ) : reliefChart.length === 0 ? (
            <p className="text-sm text-muted">
              Sem registos de alívio ainda. Marca exercícios e depois indica o
              alívio no Início.
            </p>
          ) : (
            <div
              className="flex min-h-[168px] flex-wrap items-end justify-center gap-3 sm:gap-4"
              role="img"
              aria-label="Gráfico de alívio após sessão"
            >
              {reliefChart.map((r, i) => {
                const h = Math.round((r.relief_score / maxRelief) * 120);
                return (
                  <div
                    key={`${r.logged_on}-${i}`}
                    className="flex h-[148px] w-11 shrink-0 flex-col items-center justify-end gap-1.5 sm:w-12"
                  >
                    <div
                      className="w-full min-h-2 rounded-t-lg bg-emerald-500 shadow-sm transition-all"
                      style={{ height: `${Math.max(h, 8)}px` }}
                      title={`Alívio ${r.relief_score}/10`}
                    />
                    <span className="w-full text-center text-[10px] font-medium text-muted tabular-nums">
                      {String(r.logged_on).slice(5, 10)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl text-foreground mb-2">
          Dor no check-in vs alívio (últimos 14 dias)
        </h2>
        <p className="text-sm text-muted mb-4 max-w-2xl">
          <span className="inline-block w-3 h-3 rounded-sm bg-primary/80 align-middle mr-1" />{" "}
          dor no registo diário ·{" "}
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500/85 align-middle mr-1" />{" "}
          alívio após sessão (mesmo dia).
        </p>
        <Card padding="lg">
          <div
            className="-mx-1 flex min-h-[188px] items-end justify-center gap-1.5 overflow-x-auto px-1 pb-1 sm:gap-2"
            role="img"
            aria-label="Comparação dor e alívio por dia"
          >
            {comparisonDays.map((day) => {
              const pain = painByDay.get(day);
              const relief = reliefByDay.get(day);
              const painH = pain != null ? Math.round((pain / maxPain) * 100) : 0;
              const reliefH =
                relief != null ? Math.round((relief / maxRelief) * 100) : 0;
              return (
                <div
                  key={day}
                  className="flex h-[172px] w-9 shrink-0 flex-col items-center justify-end gap-1 sm:w-10"
                >
                  <div className="flex h-[128px] w-full items-end justify-center gap-1">
                    <div
                      className="w-3.5 rounded-t-md bg-primary sm:w-4"
                      style={{
                        height:
                          pain != null ? `${Math.max(painH, 8)}px` : "6px",
                        opacity: pain != null ? 1 : 0.25,
                      }}
                      title={
                        pain != null ? `Dor ${pain}/10` : "Sem check-in de dor"
                      }
                    />
                    <div
                      className="w-3.5 rounded-t-md bg-emerald-500 sm:w-4"
                      style={{
                        height:
                          relief != null
                            ? `${Math.max(reliefH, 8)}px`
                            : "6px",
                        opacity: relief != null ? 1 : 0.25,
                      }}
                      title={
                        relief != null
                          ? `Alívio ${relief}/10`
                          : "Sem registo de alívio"
                      }
                    />
                  </div>
                  <span className="text-center text-[9px] font-medium text-muted tabular-nums sm:text-[10px]">
                    {day.slice(8, 10)}/{day.slice(5, 7)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section>
        <h2 className="font-display text-xl text-foreground mb-4">Humor</h2>
        <ul className="space-y-3">
          {(moodLogs ?? []).slice(0, 8).map((m) => {
            const pct = moodBar(m.mood_label);
            const label =
              MOOD_LABELS[m.mood_label as MoodOption] ?? m.mood_label;
            return (
              <li key={m.logged_at as string}>
                <Card padding="sm">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-foreground font-medium">{label}</span>
                    <time className="text-muted text-xs tabular-nums">
                      {new Date(m.logged_at as string).toLocaleDateString("pt-PT")}
                    </time>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
        {(moodLogs ?? []).length === 0 && (
          <p className="text-sm text-muted">Sem registos de humor ainda.</p>
        )}
      </section>
    </div>
  );
}
