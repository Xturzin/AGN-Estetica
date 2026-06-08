import { Hanken_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "react-hot-toast";
import "@/frontend/styles/tokens.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata = {
  title: "AGN Estética",
  description: "Sistema de gestão clínica e app do paciente.",
  manifest: "/manifest.json",
  themeColor: "#E0B7AC",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default" as const,
    title: "AGN",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#E0B7AC",
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
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: "var(--ink)",
              color: "#fff",
              borderRadius: 12,
              fontSize: 14,
              padding: "12px 16px",
            },
          }}
        />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}