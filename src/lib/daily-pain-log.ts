import { createClient } from "@/lib/supabase/server";

/** Há pelo menos uma entrada em `user_pain_logs` no dia UTC corrente. */
export async function hasPainLogToday(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
  ).toISOString();
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
  ).toISOString();

  const { count, error } = await supabase
    .from("user_pain_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("logged_at", start)
    .lt("logged_at", end);

  if (error) return false;
  return (count ?? 0) > 0;
}
