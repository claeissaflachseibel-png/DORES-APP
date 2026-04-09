"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServerActionClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createServerActionClient();
  await supabase.auth.signOut();
  redirect("/");
}

export type QuickLogState = {
  error?: string;
  ok?: boolean;
  /** Para sugestão de treino no cliente (planos pagos). */
  painLevel?: number;
  mood?: string;
};

export async function updatePainAndMood(
  _prev: QuickLogState | undefined,
  formData: FormData
): Promise<QuickLogState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const painRaw = Number(formData.get("pain_level"));
  const mood = String(formData.get("mood") ?? "").trim();
  const painLevel =
    Number.isFinite(painRaw) && painRaw >= 1 && painRaw <= 10
      ? Math.round(painRaw)
      : 5;

  if (Number.isFinite(painRaw) && painRaw >= 1 && painRaw <= 10) {
    await supabase.from("profiles").update({ current_pain_level: painRaw }).eq("id", user.id);
    await supabase.from("user_pain_logs").insert({
      user_id: user.id,
      level: painRaw,
      frequency: null,
    });
  }

  if (mood) {
    await supabase.from("profiles").update({ last_mood: mood }).eq("id", user.id);
    await supabase.from("user_mood_logs").insert({
      user_id: user.id,
      mood_label: mood,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath("/exercises");
  return { ok: true, painLevel, mood: mood || undefined };
}
