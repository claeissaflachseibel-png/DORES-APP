/** Datas ISO `YYYY-MM-DD`, ordem qualquer; devolve dias únicos. */
export function uniqueCompletionDays(dates: string[]): string[] {
  return [...new Set(dates)].sort((a, b) => b.localeCompare(a));
}

/**
 * Sequência de dias consecutivos a partir da data mais recente com atividade.
 * Considera válido se a última atividade foi hoje ou ontem (fuso local).
 */
export function computeUsageStreak(completedOnDates: string[]): number {
  const sorted = uniqueCompletionDays(completedOnDates);
  if (sorted.length === 0) return 0;

  const today = localDateString(new Date());
  const yesterday = localDateString(addDays(new Date(), -1));
  const mostRecent = sorted[0];

  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = parseISODate(sorted[i - 1]);
    const cur = parseISODate(sorted[i]);
    const diff = Math.round((prev.getTime() - cur.getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
