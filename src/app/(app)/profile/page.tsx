import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/profile";
import { Button, buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getRegionBySlug } from "@/data/pain-regions";
import { planLabel } from "@/lib/access/plan-access";
import { getSessionProfile } from "@/lib/profile";

export default async function ProfilePage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");

  const { profile, user } = session;
  const region = profile.primary_region_slug
    ? getRegionBySlug(profile.primary_region_slug)
    : null;
  const purchased = profile.purchased_region_slug
    ? getRegionBySlug(profile.purchased_region_slug)
    : null;

  return (
    <div className="space-y-8 max-w-lg">
      <header>
        <h1 className="font-display text-3xl text-foreground">Perfil</h1>
        <p className="text-sm text-muted mt-2">Conta e preferências.</p>
      </header>

      <Card padding="lg" className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted uppercase">Nome</p>
          <p className="text-foreground font-medium mt-1">
            {profile.full_name ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted uppercase">Email</p>
          <p className="text-foreground mt-1">{user.email ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted uppercase">Plano</p>
          <p className="text-foreground font-medium mt-1">
            {planLabel(profile.plan)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted uppercase">
            Região principal (onboarding)
          </p>
          <p className="text-foreground mt-1">{region?.label ?? "—"}</p>
        </div>
        {profile.plan === "single_region" && purchased && (
          <div>
            <p className="text-xs font-medium text-muted uppercase">
              Região desbloqueada
            </p>
            <p className="text-foreground mt-1">{purchased.label}</p>
          </div>
        )}
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/plans"
          className={buttonClassName({
            variant: "secondary",
            className: "inline-flex w-full flex-1",
          })}
        >
          Gerir plano
        </Link>
        <form action={signOut} className="flex-1">
          <Button type="submit" variant="outline" className="w-full">
            Sair
          </Button>
        </form>
      </div>
    </div>
  );
}
