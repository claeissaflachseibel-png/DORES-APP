import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/profile";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  if (session.profile.onboarding_completed) redirect("/dashboard");

  return (
    <div className="min-h-dvh bg-background py-8 px-4 sm:px-6">
      <OnboardingForm />
    </div>
  );
}
