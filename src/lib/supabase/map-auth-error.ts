/** Mensagem legível para erros de rede ao falar com o Supabase. */
export function mapSupabaseNetworkError(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("fetch failed") ||
    m.includes("network") ||
    m.includes("econnrefused") ||
    m.includes("enotfound") ||
    m.includes("getaddrinfo")
  ) {
    return (
      "Não foi possível ligar ao Supabase. Abre o .env.local e confirma se o " +
      "NEXT_PUBLIC_SUPABASE_URL é exactamente o «Project URL» em Supabase → " +
      "Settings → API (usa o botão copiar). Um carácter errado (por exemplo " +
      "trocar lc por ic no id do projeto) faz o registo falhar com «fetch failed»."
    );
  }
  return message;
}

/** Erros frequentes do Auth (email/palavra-passe, confirmação). */
export function mapAuthErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("invalid login credentials") ||
    m.includes("invalid_credentials")
  ) {
    return (
      "Email ou palavra-passe incorrectos. Confirma letra a letra o email " +
      "(erros típicos: gmail.com vs gmai.com) e que já confirmaste o email se o Supabase exigir."
    );
  }
  if (
    m.includes("email not confirmed") ||
    m.includes("email_not_confirmed")
  ) {
    return (
      "A conta ainda não foi confirmada. Abre o email do Supabase e clica no link " +
      "«Confirmar» antes de entrar com a palavra-passe."
    );
  }
  return mapSupabaseNetworkError(message);
}

/** Códigos curtos na query após redirect falhado (URL limpa). */
export function signInErrorCodeFromMessage(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("fetch failed") ||
    m.includes("network") ||
    m.includes("econnrefused") ||
    m.includes("enotfound") ||
    m.includes("getaddrinfo")
  ) {
    return "network";
  }
  if (
    m.includes("email not confirmed") ||
    m.includes("email_not_confirmed")
  ) {
    return "unconfirmed";
  }
  return "credentials";
}

export function messageForSigninErr(code: string | undefined): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    config:
      "Servidor sem Supabase configurado (.env.local: NEXT_PUBLIC_SUPABASE_URL e ANON_KEY).",
    empty: "Preenche email e palavra-passe.",
    credentials: mapAuthErrorMessage("Invalid login credentials"),
    unconfirmed: mapAuthErrorMessage("Email not confirmed"),
    network: mapSupabaseNetworkError("fetch failed"),
  };
  return map[code] ?? map.credentials;
}

export function signUpErrorCodeFromMessage(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("fetch failed") ||
    m.includes("network") ||
    m.includes("econnrefused") ||
    m.includes("enotfound") ||
    m.includes("getaddrinfo")
  ) {
    return "network";
  }
  if (
    m.includes("already registered") ||
    m.includes("already been registered") ||
    m.includes("user already") ||
    m.includes("email address is already") ||
    m.includes("user_already_exists") ||
    m.includes("email_exists")
  ) {
    return "exists";
  }
  if (
    m.includes("password") &&
    (m.includes("6") ||
      m.includes("least") ||
      m.includes("short") ||
      m.includes("weak") ||
      m.includes("pwned"))
  ) {
    return "password_weak";
  }
  if (
    m.includes("invalid email") ||
    (m.includes("email address") && m.includes("invalid")) ||
    m.includes("email_address_invalid") ||
    m.includes("unable to validate email")
  ) {
    return "email_invalid";
  }
  /* Só frases típicas de rate limit — evitar "too many" isolado (falsos positivos). */
  if (
    m.includes("rate limit") ||
    m.includes("too many requests") ||
    m.includes("too_many_requests") ||
    m.includes("over_request_rate_limit") ||
    m.includes("over_email_send_rate_limit") ||
    m.includes("email rate limit") ||
    m.includes("only request this after")
  ) {
    return "rate_limit";
  }
  if (
    (m.includes("signup") && m.includes("disabled")) ||
    m.includes("signup_disabled") ||
    (m.includes("email provider") && m.includes("disabled"))
  ) {
    return "disabled";
  }
  if (
    m.includes("database error") ||
    m.includes("saving new user") ||
    (m.includes("hook") && m.includes("timeout"))
  ) {
    return "hook_failed";
  }
  if (m.includes("captcha")) {
    return "captcha";
  }
  return "generic";
}

/** Usa `error.code` do GoTrue quando existir (mais fiável que só a mensagem). */
export function signUpErrorCodeFromAuth(error: {
  message: string;
  code?: string;
}): string {
  const c = String(error.code ?? "")
    .toLowerCase()
    .trim();
  if (
    c === "user_already_exists" ||
    c === "email_exists" ||
    c === "identity_already_exists"
  ) {
    return "exists";
  }
  if (c === "weak_password") return "password_weak";
  if (c === "email_address_invalid") return "email_invalid";
  /* validation_failed pode ser palavra-passe, email, etc. — usar a mensagem. */
  if (c === "validation_failed") {
    return signUpErrorCodeFromMessage(error.message);
  }
  if (c === "signup_disabled" || c === "email_provider_disabled") {
    return "disabled";
  }
  if (
    c === "over_request_rate_limit" ||
    c === "over_email_send_rate_limit" ||
    c === "over_sms_send_rate_limit"
  ) {
    return "rate_limit";
  }
  if (c === "hook_timeout" || c === "hook_timeout_after_retry") {
    return "hook_failed";
  }
  if (c === "captcha_failed") return "captcha";
  if (c === "email_address_not_authorized") return "email_blocked";
  return signUpErrorCodeFromMessage(error.message);
}

export function messageForSignupErr(code: string | undefined): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    config:
      "Servidor sem Supabase configurado (.env.local: NEXT_PUBLIC_SUPABASE_URL e ANON_KEY).",
    empty: "Preenche nome, email e palavra-passe.",
    exists:
      "Esse email já está registado. Entra em «Entrar» ou usa outro email.",
    password_weak:
      "A palavra-passe é fraca ou curta demais. Usa pelo menos 6 caracteres; se o Supabase exigir mais forte, combina letras e números.",
    email_invalid:
      "O email não é válido. Confirma que não há espaços e que o domínio está correcto (ex.: gmail.com).",
    rate_limit:
      "Muitas tentativas seguidas. Espera um ou dois minutos e tenta outra vez.",
    disabled:
      "Registo por email está desactivado no projeto Supabase (Authentication → Providers → Email).",
    hook_failed:
      "O Supabase não conseguiu concluir o registo (hook ou base de dados). No dashboard: Logs → Auth, e confirma que a tabela «profiles» e o trigger «on_auth_user_created» existem.",
    captcha:
      "Validação captcha falhou. Recarrega a página e tenta de novo.",
    email_blocked:
      "Este email não é permitido nas regras do teu projeto Supabase.",
    network: mapSupabaseNetworkError("fetch failed"),
    generic:
      "Não foi possível criar a conta. Verifica o email e a palavra-passe; se o erro continuar, vê Auth Logs no Supabase (erros de hook ou RLS na tabela profiles).",
  };
  return map[code] ?? map.generic;
}
