"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  mockActivateFull,
  mockActivateSingleRegion,
} from "@/app/actions/subscription";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PAIN_REGIONS } from "@/data/pain-regions";
import type { PainRegionSlug, PlanTier } from "@/types";

export function PlansClient({ currentPlan }: { currentPlan: PlanTier }) {
  const router = useRouter();
  const [region, setRegion] = useState<PainRegionSlug>("lombar");
  const [loading, setLoading] = useState<"single" | "full" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSingle() {
    setLoading("single");
    setMsg(null);
    const r = await mockActivateSingleRegion(region);
    setLoading(null);
    if (r.error) setMsg(r.error);
    else {
      setMsg("Plano região única ativado (simulação).");
      router.refresh();
    }
  }

  async function onFull() {
    setLoading("full");
    setMsg(null);
    const r = await mockActivateFull();
    setLoading(null);
    if (r.error) setMsg(r.error);
    else {
      setMsg("Plano completo ativado (simulação).");
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {msg && (
        <p className="text-sm text-center text-primary bg-accent rounded-2xl py-3 px-4">
          {msg}
        </p>
      )}

      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        <Card
          className={`flex flex-col ${currentPlan === "free" ? "ring-2 ring-primary/30" : ""}`}
          padding="lg"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">
            Gratuito
          </p>
          <p className="font-display text-2xl text-foreground mt-2">0 €</p>
          <ul className="mt-4 space-y-2 text-sm text-muted flex-1">
            <li>1 região escolhida no início</li>
            <li>3 exercícios dessa região</li>
            <li>Registo de dor e humor</li>
            <li>Progresso básico</li>
          </ul>
          <p className="text-xs text-muted mt-4">
            {currentPlan === "free"
              ? "O teu plano atual."
              : "Incluído em todas as contas."}
          </p>
        </Card>

        <Card
          className={`flex flex-col border-primary/30 bg-accent/20 ${currentPlan === "single_region" ? "ring-2 ring-primary/30" : ""}`}
          padding="lg"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">
            Região única
          </p>
          <p className="font-display text-2xl text-foreground mt-2">Em breve</p>
          <p className="text-sm text-muted mt-2">
            Jornada completa numa zona — histórico e exercícios ilimitados dessa
            região.
          </p>
          <label className="block mt-4 text-sm font-medium text-foreground">
            Região a desbloquear (demo)
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as PainRegionSlug)}
              className="mt-2 w-full min-h-12 rounded-2xl border border-border bg-card px-4"
              disabled={currentPlan === "full"}
            >
              {PAIN_REGIONS.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-6">
            <Button
              type="button"
              className="w-full"
              disabled={
                loading !== null || currentPlan === "full" || currentPlan === "single_region"
              }
              onClick={onSingle}
            >
              {loading === "single"
                ? "A processar…"
                : "Ativar (checkout futuro)"}
            </Button>
          </div>
          <p className="text-xs text-muted mt-3">
            Botão preparado para Stripe: substitui por sessão de pagamento.
          </p>
          {currentPlan === "single_region" && (
            <p className="text-xs font-medium text-primary mt-2">Plano atual.</p>
          )}
        </Card>

        <Card
          className={`flex flex-col ${currentPlan === "full" ? "ring-2 ring-primary/30" : ""}`}
          padding="lg"
        >
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">
            Completo
          </p>
          <p className="font-display text-2xl text-foreground mt-2">Em breve</p>
          <ul className="mt-4 space-y-2 text-sm text-muted flex-1">
            <li>Todas as regiões e protocolos</li>
            <li>Troca livre de foco</li>
            <li>Histórico e progresso completos</li>
          </ul>
          <Button
            type="button"
            variant="secondary"
            className="w-full mt-6"
            disabled={loading !== null || currentPlan === "full"}
            onClick={onFull}
          >
            {loading === "full" ? "A processar…" : "Ativar tudo (demo)"}
          </Button>
          <p className="text-xs text-muted mt-3">
            Webhook pós-pagamento deve atualizar `profiles.plan` e `subscriptions`.
          </p>
          {currentPlan === "full" && (
            <p className="text-xs font-medium text-primary mt-2">Plano atual.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
