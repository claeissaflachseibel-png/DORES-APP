import { connection } from "next/server";
import { DailyPainBanner } from "@/components/daily-pain-banner";
import { AppShell } from "@/components/layout/app-shell";
import { hasPainLogToday } from "@/lib/daily-pain-log";
import { getSessionProfile } from "@/lib/profile";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const session = await getSessionProfile();
  const showDailyPrompt =
    session != null &&
    session.profile.onboarding_completed &&
    !(await hasPainLogToday(session.user.id));

  return (
    <AppShell banner={showDailyPrompt ? <DailyPainBanner /> : null}>
      {children}
    </AppShell>
  );
}
