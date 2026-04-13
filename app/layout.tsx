import type { Metadata } from "next";
import { Playfair_Display, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

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

export const metadata: Metadata = {
  title: "ONPE Needle — Elecciones Generales Perú 2026",
  description:
    "Dashboard en tiempo real de las Elecciones Generales Perú 2026. Resultados actualizados cada 30 segundos.",
  openGraph: {
    title: "ONPE Needle — Elecciones Perú 2026 EN VIVO",
    description: "Resultados en tiempo real. Actualización automática cada 30s.",
    type: "website",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
