/**
 * Origem pública do site (sem barra final). Alinha com «Site URL» / redirects no Supabase.
 */
export function publicAppOrigin(fallbackOrigin: string): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const raw = (env && env.length > 0 ? env : fallbackOrigin).trim();
  return raw.replace(/\/+$/, "") || fallbackOrigin.replace(/\/+$/, "");
}

/** URL enviada ao Supabase em `emailRedirectTo` (tem de estar em Redirect URLs no dashboard). */
export function authEmailCallbackUrl(fallbackOrigin: string): string {
  return `${publicAppOrigin(fallbackOrigin)}/auth/callback`;
}

/** Mensagem para o utilizador se faltar configuração pública do Supabase. */
export function missingSupabasePublicEnvMessage(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    return "O Supabase não está configurado. Cria o ficheiro `.env.local` na pasta `dores-app` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (copia `.env.example` e preenche com os dados do teu projeto em supabase.com → Settings → API).";
  }
  return null;
}
