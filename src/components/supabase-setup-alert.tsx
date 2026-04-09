import { missingSupabasePublicEnvMessage } from "@/lib/supabase/config";

export function SupabaseSetupAlert() {
  const msg = missingSupabasePublicEnvMessage();
  if (!msg) {
    return null;
  }
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 border-b border-danger/40 bg-danger/10 px-4 py-3 text-center"
      role="alert"
    >
      <p className="text-sm text-foreground max-w-3xl mx-auto leading-relaxed">{msg}</p>
    </div>
  );
}
