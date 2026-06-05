import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/frontend/styles/tokens.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AGN Estética",
  description: "Sistema de gestão para clínica estética",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="pt-BR">
      <body className={`${hankenGrotesk.variable} agn`}>
        {children}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}