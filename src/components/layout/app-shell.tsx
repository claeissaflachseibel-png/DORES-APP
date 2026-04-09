"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const nav = [
  { href: "/dashboard", label: "Início", icon: "◉" },
  { href: "/exercises", label: "Exercícios", icon: "◎" },
  { href: "/progress", label: "Progresso", icon: "◐" },
  { href: "/plans", label: "Planos", icon: "◇" },
  { href: "/profile", label: "Perfil", icon: "○" },
];

export function AppShell({
  children,
  banner,
}: {
  children: ReactNode;
  banner?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh flex min-w-0 flex-col bg-background pb-24 sm:pb-0 sm:pl-56">
      <aside className="hidden sm:flex fixed left-0 top-0 bottom-0 z-30 w-56 flex-col gap-1 border-r border-border bg-card py-8 px-4">
        <Link
          href="/dashboard"
          className="font-display text-xl text-primary mb-8 px-3"
        >
          Dores+
        </Link>
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent text-primary"
                  : "text-muted hover:bg-accent/60 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </aside>

      <main className="mx-auto flex min-h-0 w-full min-w-0 max-w-6xl flex-1 py-6 sm:max-w-none sm:py-10 xl:max-w-7xl pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(2rem,env(safe-area-inset-right,0px))]">
        {banner}
        {children}
      </main>

      <nav
        className="fixed bottom-0 inset-x-0 z-40 sm:hidden border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]"
        aria-label="Navegação principal"
      >
        <ul className="flex justify-around items-stretch max-w-lg mx-auto py-2 gap-0.5">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href} className="flex-1 min-w-0">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium min-h-[52px] justify-center ${
                    active ? "text-primary" : "text-muted"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="text-lg leading-none" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="truncate w-full text-center px-0.5">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
