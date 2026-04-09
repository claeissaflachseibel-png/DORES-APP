import { redirect } from "next/navigation";
import { PlansClient } from "./plans-client";
import { getSessionProfile } from "@/lib/profile";

export default async function PlansPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (!session.profile.onboarding_completed) redirect("/onboarding");

  return (
    <div className="space-y-8 max-w-6xl">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl text-foreground">
          Planos
        </h1>
        <p className="text-muted mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
          Compara o que faz sentido para ti. Os botões abaixo simulam um checkout —
          em produção ligam ao teu fornecedor de pagamento (por exemplo Stripe) e
          confirmam a subscrição via webhook seguro.
        </p>
      </header>
      <PlansClient currentPlan={session.profile.plan} />
    </div>
  );
}
