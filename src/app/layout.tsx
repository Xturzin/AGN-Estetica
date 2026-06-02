import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}