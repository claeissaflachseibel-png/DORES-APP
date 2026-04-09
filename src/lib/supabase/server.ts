import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local"
    );
  }
  return { url, key };
}

function createServerClientWithCookies(
  cookieStore: CookieStore,
  setPolicy: "rsc-safe" | "action"
) {
  const { url, key } = getSupabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options: CookieOptions;
        }[],
        headers: Record<string, string>
      ) {
        if (setPolicy === "rsc-safe") {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* RSC / render: middleware renova a sessão no próximo pedido */
          }
        } else {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        }
        void headers;
      },
    },
  });
}

/** RSC, layouts e páginas. Escrever cookies pode falhar — ignorado de propósito. */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClientWithCookies(cookieStore, "rsc-safe");
}

/** Server Actions que definem ou limpam sessão (login, registo, sair). */
export async function createServerActionClient() {
  const cookieStore = await cookies();
  return createServerClientWithCookies(cookieStore, "action");
}
