import type { Metadata } from "next";
import { Playfair_Display, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import JsonLd from "@/components/JsonLd";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const BASE_URL = "https://onpe-needle.linderhassinger.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "ONPE Needle — Elecciones Generales Perú 2026 EN VIVO",
  description:
    "Resultados electorales en tiempo real. Elecciones Generales Perú 2026 con datos oficiales de la ONPE. Actualización automática cada 30 segundos.",
  keywords: [
    "elecciones Peru 2026",
    "ONPE resultados",
    "elecciones generales Peru",
    "resultados electorales en vivo",
    "segunda vuelta Peru",
    "presidente Peru 2026",
  ],
  authors: [{ name: "linder3hs" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Elecciones Perú 2026 EN VIVO — Resultados en tiempo real",
    description:
      "Sigue los resultados oficiales de la ONPE en tiempo real. Datos actualizados cada 30 segundos.",
    url: BASE_URL,
    siteName: "ONPE Needle",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elecciones Perú 2026 EN VIVO — Resultados en tiempo real",
    description:
      "Sigue los resultados oficiales de la ONPE en tiempo real. Datos actualizados cada 30 segundos.",
    creator: "@linder3hs",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${dmMono.variable} ${dmSans.variable} h-full`}
      style={{ colorScheme: "dark" }}
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
        }}
      >
        <JsonLd />
        <Providers>{children}</Providers>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "381c410f3832404db89df5103214c830"}'
        />
      </body>
    </html>
  );
}
