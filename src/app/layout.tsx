import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import AuthBootstrap from "@/components/providers/AuthBootstrap";
import QueryProvider from "@/lib/query/provider";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContractAI - Inteligencia para los Contratos Modernos",
  description: "Optimiza contratos y consultas legales con inteligencia artificial de nivel empresarial. Precisión, rapidez y control para documentación legal de alto impacto.",
  icons: {
    icon: "/logo-contractAI-azul.png",
  },
  verification: {
    google: "-sOhJfT_dGPqlZ7Tu48h_uW6nKh69lZ5HMCm1T9AgdY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthBootstrap>{children}</AuthBootstrap>
        </QueryProvider>
      </body>
    </html>
  );
}
