"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  authEmailCallbackUrl,
  missingSupabasePublicEnvMessage,
} from "@/lib/supabase/config";
import {
  mapSupabaseNetworkError,
  messageForSignupErr,
  signUpErrorCodeFromAuth,
} from "@/lib/supabase/map-auth-error";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SignupForm({ signupErrCode }: { signupErrCode?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const urlHint = messageForSignupErr(signupErrCode);
  const displayError = error ?? urlHint;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const missing = missingSupabasePublicEnvMessage();
    if (missing) {
      setError(missing);
      return;
    }
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const fullName = String(fd.get("full_name") ?? "").trim();
    if (!email || !password || !fullName) {
      setError(messageForSignupErr("empty"));
      return;
    }

    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const callback = authEmailCallbackUrl(origin);

    setPending(true);
    try {
      const supabase = createClient();
      const { data, error: signErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: callback,
        },
      });

      if (signErr) {
        setPending(false);
        const errObj = signErr as { message: string; code?: string };
        const code = signUpErrorCodeFromAuth({
          message: errObj.message,
          code: errObj.code,
        });
        setError(
          messageForSignupErr(code) ?? mapSupabaseNetworkError(signErr.message)
        );
        return;
      }

      if (!data.user) {
        setPending(false);
        setError(messageForSignupErr("exists"));
        return;
      }

      /* Com sessão: actualiza nome em background (não bloquear redirect). */
      if (data.session) {
        void supabase
          .from("profiles")
          .update({ full_name: fullName })
          .eq("id", data.user.id);
      }

      if (data.session) {
        const base =
          typeof window !== "undefined" ? window.location.origin : "";
        window.location.href = `${base}/dashboard`;
        return;
      }

      const base = typeof window !== "undefined" ? window.location.origin : "";
      window.location.href = `${base}/login?check_email=1`;
    } catch (err) {
      setPending(false);
      const msg = err instanceof Error ? err.message : String(err);
      setError(mapSupabaseNetworkError(msg));
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-12 bg-background">
      <Link
        href="/"
        className="font-display text-2xl text-primary mb-8 hover:opacity-80"
      >
        Dores+
      </Link>
      <Card className="w-full max-w-md" padding="lg">
        <h1 className="font-display text-2xl text-foreground">Criar conta</h1>
        <p className="text-sm text-muted mt-2">
          Começas no plano gratuito: 1 região e 3 exercícios.
        </p>
        {displayError ? (
          <p className="mt-4 text-sm text-danger" role="alert">
            {displayError}
          </p>
        ) : null}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="full_name"
              className="text-sm font-medium text-foreground block mb-1.5"
            >
              Nome
            </label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              placeholder="O teu nome"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground block mb-1.5"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="nome@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground block mb-1.5"
            >
              Palavra-passe
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? "A criar conta…" : "Registar"}
            </Button>
          </div>
        </form>
        <p className="text-sm text-muted mt-6 text-center">
          Já tens conta?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
