import { SupabaseSetupAlert } from "@/components/supabase-setup-alert";
import { SignupForm } from "./signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ signup_err?: string }>;
}) {
  const q = await searchParams;
  return (
    <>
      <SupabaseSetupAlert />
      <SignupForm signupErrCode={q.signup_err} />
    </>
  );
}
