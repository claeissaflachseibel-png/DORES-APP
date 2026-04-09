import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { signInErrorCodeFromMessage } from "@/lib/supabase/map-auth-error";
import { safePostLoginPath } from "@/lib/supabase/safe-redirect";

export const dynamic = "force-dynamic";

/**
 * Login: POST (form ou JSON) → 303 redirect + Set-Cookie na mesma resposta.
 */
export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    const u = new URL("/login", origin);
    u.searchParams.set("signin_err", "config");
    return NextResponse.redirect(u, 303);
  }

  const contentType = request.headers.get("content-type") ?? "";
  let email = "";
  let password = "";
  let nextRaw: string | undefined;

  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as {
        email?: string;
        password?: string;
        next?: string;
      };
      email = String(body.email ?? "").trim();
      password = String(body.password ?? "");
      nextRaw = body.next;
    } catch {
      const u = new URL("/login", origin);
      u.searchParams.set("signin_err", "empty");
      return NextResponse.redirect(u, 303);
    }
  } else {
    const fd = await request.formData();
    email = String(fd.get("email") ?? "").trim();
    password = String(fd.get("password") ?? "");
    const n = fd.get("next");
    if (typeof n === "string" && n.length > 0) nextRaw = n;
  }

  if (!email || !password) {
    const u = new URL("/login", origin);
    u.searchParams.set("signin_err", "empty");
    return NextResponse.redirect(u, 303);
  }

  const targetPath = safePostLoginPath(nextRaw);
  const targetUrl = new URL(targetPath, origin);
  const response = NextResponse.redirect(targetUrl, 303);

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([k, v]) => {
          response.headers.set(k, v);
        });
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const u = new URL("/login", origin);
    u.searchParams.set("signin_err", signInErrorCodeFromMessage(error.message));
    return NextResponse.redirect(u, 303);
  }

  return response;
}
