import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dores+ | Movimento guiado para o seu conforto",
  description:
    "Programas simples de exercícios e alongamentos para dores musculares e articulares. Pensado para o dia a dia europeu.",
};

/** Mobile: encaixa com notch / barra inicial; safe-area no CSS. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
