"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markExerciseComplete(exerciseSlug: string, regionSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase.from("user_progress").insert({
    user_id: user.id,
    exercise_slug: exerciseSlug,
    region_slug: regionSlug,
    completed_on: today,
  });

  if (error) {
    if (error.code === "23505") {
      /* já registado hoje */
    } else {
      return { error: error.message };
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/progress");
  revalidatePath("/exercises");
  return { ok: true };
}
