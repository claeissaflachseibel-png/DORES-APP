"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SessionReliefState = { error?: string; ok?: boolean };

export async function upsertSessionRelief(
  _prev: SessionReliefState | undefined,
  formData: FormData
): Promise<SessionReliefState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const raw = Number(formData.get("relief_score"));
  if (!Number.isFinite(raw) || raw < 1 || raw > 10) {
    return { error: "Valor inválido (1–10)." };
  }

  const relief_score = Math.round(raw);
  const today = new Date().toISOString().slice(0, 10);

  const { data: row } = await supabase
    .from("session_relief_logs")
    .select("id")
    .eq("user_id", user.id)
    .eq("logged_on", today)
    .maybeSingle();

  const { error } = row?.id
    ? await supabase
        .from("session_relief_logs")
        .update({ relief_score })
        .eq("id", row.id)
    : await supabase.from("session_relief_logs").insert({
        user_id: user.id,
        logged_on: today,
        relief_score,
      });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/progress");
  return { ok: true };
}
