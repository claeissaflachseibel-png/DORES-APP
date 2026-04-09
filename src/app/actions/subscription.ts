"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PainRegionSlug } from "@/types";

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

/**
 * Simula checkout: ativa plano região única (MVP).
 * Em produção, substituir por webhook Stripe após pagamento confirmado.
 */
export async function mockActivateSingleRegion(regionSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };
  if (!isRegion(regionSlug)) return { error: "Região inválida" };

  await supabase
    .from("profiles")
    .update({
      plan: "single_region",
      purchased_region_slug: regionSlug,
    })
    .eq("id", user.id);

  await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan: "single_region",
    region_slug: regionSlug,
    status: "mock_active",
    provider: "mock",
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function mockActivateFull() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  await supabase
    .from("profiles")
    .update({
      plan: "full",
      purchased_region_slug: null,
    })
    .eq("id", user.id);

  await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan: "full",
    region_slug: null,
    status: "mock_active",
    provider: "mock",
  });

  revalidatePath("/", "layout");
  return { ok: true };
}
