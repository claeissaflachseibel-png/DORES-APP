import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { INTERNAL_APP_PREFIXES, safePostLoginPath } from "@/lib/supabase/safe-redirect";

const AUTH_PAGES = ["/login", "/signup"];

function isProtectedPath(pathname: string) {
  return INTERNAL_APP_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

/**
 * O Supabase grava cookies refrescados em `supabaseResponse`. Um redirect novo
 * sem copiar essas cookies quebra a sessão (login parece “não redirecionar”).
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
function redirectWithSupabaseCookies(
  supabaseResponse: NextResponse,
  url: URL | string
): NextResponse {
  const redirect = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirect.cookies.set(cookie);
  });
  return redirect;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
        Object.entries(headers).forEach(([k, v]) =>
          supabaseResponse.headers.set(k, v)
        );
      },
    },
  });

  /* Atualiza cookies da sessão antes de validar o utilizador (evita GET sem user após login). */
  await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && isProtectedPath(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return redirectWithSupabaseCookies(supabaseResponse, redirectUrl);
  }

  if (user && AUTH_PAGES.includes(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    const target = safePostLoginPath(redirectUrl.searchParams.get("redirect"));
    redirectUrl.pathname = target;
    redirectUrl.search = "";
    return redirectWithSupabaseCookies(supabaseResponse, redirectUrl);
  }

  return supabaseResponse;
}
