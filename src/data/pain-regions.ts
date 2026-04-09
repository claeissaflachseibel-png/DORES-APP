import type { PainRegion, PainRegionSlug } from "@/types";

export const PAIN_REGIONS: PainRegion[] = [
  { slug: "lombar", label: "Lombar", shortLabel: "Costas baixas" },
  { slug: "pescoco", label: "Pescoço", shortLabel: "Região cervical" },
  { slug: "ombro", label: "Ombro", shortLabel: "Cintura escapular" },
  { slug: "joelho", label: "Joelho", shortLabel: "Articulação do joelho" },
  { slug: "quadril", label: "Quadril", shortLabel: "Articulação do quadril" },
  { slug: "punho", label: "Punho", shortLabel: "Punho e antebraço" },
  { slug: "tornozelo", label: "Tornozelo", shortLabel: "Tornozelo e pé" },
];

export function getRegionBySlug(slug: string): PainRegion | undefined {
  return PAIN_REGIONS.find((r) => r.slug === slug as PainRegionSlug);
}
