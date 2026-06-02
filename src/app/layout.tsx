import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "@/frontend/styles/tokens.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AGN Estética",
  description: "Gestão para clínicas de estética",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${hankenGrotesk.variable} agn`}>{children}</body>
    </html>
  );
}