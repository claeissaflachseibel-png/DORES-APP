import { SupabaseSetupAlert } from "@/components/supabase-setup-alert";
import { safePostLoginPath } from "@/lib/supabase/safe-redirect";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    check_email?: string;
    confirmed?: string;
    reason?: string;
    signin_err?: string;
    redirect?: string;
  }>;
}) {
  const q = await searchParams;
  const nextAfterLogin = q.redirect
    ? safePostLoginPath(q.redirect)
    : "/dashboard";
  return (
    <>
      <SupabaseSetupAlert />
      <LoginForm
        authError={q.error === "auth"}
        authErrorReason={q.reason}
        configError={q.error === "config"}
        checkEmail={q.check_email === "1"}
        emailConfirmed={q.confirmed === "1"}
        signinErrCode={q.signin_err}
        nextAfterLogin={nextAfterLogin}
      />
    </>
  );
}
