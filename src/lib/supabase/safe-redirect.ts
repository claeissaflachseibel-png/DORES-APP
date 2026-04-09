/** Rotas internas permitidas após login (evita open redirect). */
export const INTERNAL_APP_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/exercises",
  "/progress",
  "/plans",
  "/profile",
] as const;

export function safePostLoginPath(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return "/dashboard";
  const path = raw.trim().split("?")[0] ?? "";
  if (!path.startsWith("/") || path.startsWith("//")) return "/dashboard";
  if (
    INTERNAL_APP_PREFIXES.some(
      (p) => path === p || path.startsWith(`${p}/`)
    )
  ) {
    return path;
  }
  return "/dashboard";
}
