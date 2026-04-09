export type PlanTier = "free" | "single_region" | "full";

export type PainRegionSlug =
  | "lombar"
  | "pescoco"
  | "ombro"
  | "joelho"
  | "quadril"
  | "punho"
  | "tornozelo";

export interface PainRegion {
  slug: PainRegionSlug;
  label: string;
  shortLabel: string;
}

export interface ExerciseDef {
  slug: string;
  regionSlug: PainRegionSlug;
  /** Order in the clinical-style protocol (1 = first in journey) */
  order: number;
  title: string;
  description: string;
  objective: string;
  durationMinutes: number;
  repsOrTime: string;
  steps: string[];
  safetyNotes: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  plan: PlanTier;
  primary_region_slug: PainRegionSlug | null;
  purchased_region_slug: PainRegionSlug | null;
  current_pain_level: number | null;
  pain_frequency: string | null;
  last_mood: string | null;
  routine_note: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export type MoodOption =
  | "muito_baixo"
  | "baixo"
  | "neutro"
  | "bom"
  | "muito_bom";

export const MOOD_LABELS: Record<MoodOption, string> = {
  muito_baixo: "Muito baixo",
  baixo: "Baixo",
  neutro: "Neutro",
  bom: "Bom",
  muito_bom: "Muito bom",
};

export const PAIN_FREQUENCY_OPTIONS = [
  { value: "raramente", label: "Raramente" },
  { value: "algumas_vezes_semana", label: "Algumas vezes por semana" },
  { value: "quase_diario", label: "Quase todos os dias" },
  { value: "diario", label: "Todos os dias" },
] as const;
