import { createClient } from "@/lib/supabase/server";
import type { PainRegionSlug, PlanTier, UserProfile } from "@/types";

type ProfileRow = {
  id: string;
  full_name: string | null;
  plan: string;
  primary_region_slug: string | null;
  purchased_region_slug: string | null;
  current_pain_level: number | null;
  pain_frequency: string | null;
  last_mood: string | null;
  routine_note: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

function isPlanTier(p: string): p is PlanTier {
  return p === "free" || p === "single_region" || p === "full";
}

function isPainSlug(s: string | null): s is PainRegionSlug {
  if (!s) return false;
  return [
    "lombar",
    "pescoco",
    "ombro",
    "joelho",
    "quadril",
    "punho",
    "tornozelo",
  ].includes(s);
}

export function mapProfileRow(
  row: ProfileRow,
  email: string | null
): UserProfile {
  return {
    id: row.id,
    full_name: row.full_name,
    email,
    plan: isPlanTier(row.plan) ? row.plan : "free",
    primary_region_slug: isPainSlug(row.primary_region_slug)
      ? row.primary_region_slug
      : null,
    purchased_region_slug: isPainSlug(row.purchased_region_slug)
      ? row.purchased_region_slug
      : null,
    current_pain_level: row.current_pain_level,
    pain_frequency: row.pain_frequency,
    last_mood: row.last_mood,
    routine_note: row.routine_note,
    onboarding_completed: row.onboarding_completed,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getSessionProfile(): Promise<{
  user: { id: string; email?: string | null };
  profile: UserProfile;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const first = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  let row = first.data;

  if (first.error || !row) {
    await supabase.from("profiles").insert({
      id: user.id,
      plan: "free",
      onboarding_completed: false,
    });
    const { data: row2 } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    row = row2;
  }

  if (!row) return null;

  const profile = mapProfileRow(row as ProfileRow, user.email ?? null);
  return { user: { id: user.id, email: user.email }, profile };
}
