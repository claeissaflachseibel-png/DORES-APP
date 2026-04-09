"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MOOD_LABELS, type MoodOption, type PainRegionSlug } from "@/types";

const MOODS = Object.keys(MOOD_LABELS) as MoodOption[];

const REGIONS: PainRegionSlug[] = [
  "lombar",
  "pescoco",
  "ombro",
  "joelho",
  "quadril",
  "punho",
  "tornozelo",
];

function isRegion(s: string): s is PainRegionSlug {
  return REGIONS.includes(s as PainRegionSlug);
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const regionRaw = String(formData.get("region") ?? "");
  const painRaw = Number(formData.get("pain_level"));
  const frequency = String(formData.get("frequency") ?? "");
  const moodRaw = String(formData.get("mood") ?? "");
  const routine = String(formData.get("routine") ?? "").slice(0, 500);

  if (!isRegion(regionRaw)) {
    throw new Error("Região inválida");
  }
  if (!MOODS.includes(moodRaw as MoodOption)) {
    throw new Error("Humor inválido");
  }
  const mood = moodRaw as MoodOption;
  if (!Number.isFinite(painRaw) || painRaw < 1 || painRaw > 10) {
    throw new Error("Nível de dor inválido");
  }

  const { error: upErr } = await supabase
    .from("profiles")
    .update({
      primary_region_slug: regionRaw,
      current_pain_level: painRaw,
      pain_frequency: frequency,
      last_mood: mood,
      routine_note: routine || null,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (upErr) throw new Error(upErr.message);

  await supabase.from("user_pain_logs").insert({
    user_id: user.id,
    level: painRaw,
    frequency: frequency || null,
  });

  await supabase.from("user_mood_logs").insert({
    user_id: user.id,
    mood_label: mood,
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  redirect("/dashboard");
}
