"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { missingSupabasePublicEnvMessage } from "@/lib/supabase/config";
import {
  mapAuthErrorMessage,
  messageForSigninErr,
} from "@/lib/supabase/map-auth-error";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function friendlyAuthCallbackError(reason: string | undefined): string | null {
  if (!reason) return null;
  let decoded = reason;
  try {
    decoded = decodeURIComponent(reason);
  } catch {
    /* manter raw */
  }
  const r = decoded.toLowerCase();
  if (r.includes("expired") || r.includes("invalid")) {
    return "O link de confirmação expirou ou já foi usado. Pedes um novo email em «Esqueci-me da palavra-passe» no Supabase ou regista-te de novo.";
  }
  if (r.includes("redirect") && r.includes("url")) {
    return "O URL de redirecionamento não coincide com o configurado no Supabase (Authentication → URL Configuration). Adiciona http://localhost:3000/auth/callback.";
  }
  if (r.includes("code verifier") || r.includes("pkce")) {
    return "O link de confirmação foi aberto noutro navegador ou após limpar cookies. Entra com email e palavra-passe — o email já confirmado serve para isso.";
  }
  return null;
}

export function LoginForm({
  authError,
  authErrorReason,
  configError,
  checkEmail,
  emailConfirmed,
  signinErrCode,
  nextAfterLogin = "/dashboard",
}: {
  authError?: boolean;
  authErrorReason?: string;
  configError?: boolean;
  checkEmail?: boolean;
  /** Voltou do e-mail / callback sem sessão (PKCE em outro app). */
  emailConfirmed?: boolean;
  signinErrCode?: string;
  /** Destino após login (ex.: ?redirect= do middleware). */
  nextAfterLogin?: string;
}) {
  const authCallbackHint =
    authError ? friendlyAuthCallbackError(authErrorReason) : null;
  const signinMsg = messageForSigninErr(signinErrCode);
  const [clientErr, setClientErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setClientErr(null);
    const missing = missingSupabasePublicEnvMessage();
    if (missing) {
      setClientErr(missing);
      return;
    }
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!email || !password) {
      setClientErr(messageForSigninErr("empty") ?? "Preenche email e palavra-passe.");
      return;
    }
    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setPending(false);
        setClientErr(mapAuthErrorMessage(error.message));
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setPending(false);
        setClientErr(
          "Login ok, mas a sessão não ficou guardada neste navegador. Tenta limpar cookies do localhost, usar só http://localhost:3000 (sem 127.0.0.1) ou a chave «anon» legacy no .env em vez da publishable."
        );
        return;
      }
      const path = nextAfterLogin.startsWith("/")
        ? nextAfterLogin
        : "/dashboard";
      router.refresh();
      window.location.replace(`${window.location.origin}${path}`);
    } catch (err) {
      setPending(false);
      const msg = err instanceof Error ? err.message : String(err);
      setClientErr(mapAuthErrorMessage(msg));
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
        <h1 className="font-display text-2xl text-foreground">Entrar</h1>
        <p className="text-sm text-muted mt-2">
          Acesse sua jornada de exercícios.
        </p>
        {emailConfirmed && (
          <p
            className="mt-4 text-sm text-primary font-medium leading-relaxed rounded-xl bg-accent/80 border border-border px-4 py-3"
            role="status"
          >
            E-mail confirmado. Para entrar neste navegador, use o mesmo e-mail e
            senha do cadastro e clique em Entrar (abrir o link do e-mail em outro
            app não mantém a sessão aqui).
          </p>
        )}
        {checkEmail && (
          <p
            className="mt-4 text-sm text-primary font-medium leading-relaxed rounded-xl bg-accent/80 border border-border px-4 py-3"
            role="status"
          >
            Conta criada. Se o Supabase pedir confirmação, abre o email e clica
            no link; depois entra aqui com email e palavra-passe.
          </p>
        )}
        {configError && (
          <p className="mt-4 text-sm text-danger" role="alert">
            Falta configurar o Supabase no servidor (variáveis de ambiente).
          </p>
        )}
        {authError && (
          <p className="mt-4 text-sm text-danger" role="alert">
            <span className="block">
              Não foi possível concluir o login pelo link (sessão inválida).
              Entra com email e palavra-passe ou pede um novo link.
            </span>
            {authCallbackHint ? (
              <span className="block text-muted text-xs mt-2 leading-relaxed">
                {authCallbackHint}
              </span>
            ) : null}
          </p>
        )}
        {signinMsg ? (
          <p className="mt-4 text-sm text-danger" role="alert">
            {signinMsg}
          </p>
        ) : null}
        {clientErr ? (
          <p className="mt-4 text-sm text-danger" role="alert">
            {clientErr}
          </p>
        ) : null}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              autoComplete="current-password"
              required
              minLength={6}
            />
          </div>
          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? "A entrar…" : "Entrar"}
            </Button>
          </div>
        </form>
        <p className="text-sm text-muted mt-6 text-center">
          Ainda sem conta?{" "}
          <Link
            href="/signup"
            className="text-primary font-medium hover:underline"
          >
            Registar
          </Link>
        </p>
      </Card>
    </div>
  );
}
