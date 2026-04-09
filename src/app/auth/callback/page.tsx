"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { safePostLoginPath } from "@/lib/supabase/safe-redirect";

const OTP_TYPES = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
] as const;

type OtpType = (typeof OTP_TYPES)[number];

function parseHashSession(hash: string): {
  access_token: string;
  refresh_token: string;
} | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  if (access_token && refresh_token) {
    return { access_token, refresh_token };
  }
  return null;
}

function parseOtpType(raw: string | null): OtpType | null {
  if (!raw) return null;
  return OTP_TYPES.includes(raw as OtpType) ? (raw as OtpType) : null;
}

function CallbackInner() {
  const router = useRouter();
  const [hint, setHint] = useState("A concluir a sessão…");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const params = new URLSearchParams(window.location.search);
      const next = safePostLoginPath(params.get("next"));
      const origin = window.location.origin;
      const target = `${origin}${next}`;

      const oauthErr = params.get("error");
      const oauthDesc = params.get("error_description");
      if (oauthErr) {
        const reason = encodeURIComponent(oauthDesc ?? oauthErr);
        router.replace(`/login?error=auth&reason=${reason}`);
        return;
      }

      let supabase;
      try {
        supabase = createClient();
      } catch {
        router.replace("/login?error=config");
        return;
      }

      const hashSession = parseHashSession(window.location.hash);
      if (hashSession) {
        setHint("A guardar a sessão…");
        const { error } = await supabase.auth.setSession(hashSession);
        if (cancelled) return;
        if (error) {
          router.replace(
            `/login?error=auth&reason=${encodeURIComponent(error.message)}`
          );
          return;
        }
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`
        );
        window.location.replace(target);
        return;
      }

      const code = params.get("code");
      if (code) {
        setHint("A validar o código…");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          router.replace(
            `/login?error=auth&reason=${encodeURIComponent(error.message)}`
          );
          return;
        }
        window.location.replace(target);
        return;
      }

      const token_hash = params.get("token_hash");
      const otpType = parseOtpType(params.get("type"));
      if (token_hash && otpType) {
        setHint("A confirmar o email…");
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: otpType,
        });
        if (cancelled) return;
        if (error) {
          router.replace(
            `/login?error=auth&reason=${encodeURIComponent(error.message)}`
          );
          return;
        }
        window.location.replace(target);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        window.location.replace(target);
        return;
      }

      setHint("Sem sessão neste link.");
      /* Conta já pode estar confirmada; login com senha cria a sessão neste navegador. */
      router.replace("/login?confirmed=1");
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 bg-background">
      <p className="text-sm text-muted">{hint}</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex flex-col items-center justify-center bg-background">
          <p className="text-sm text-muted">A carregar…</p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
