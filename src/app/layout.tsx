import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cabecalho from "@/components/Cabecalho";
import Head from "next/head";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minha Barbearia",
  description: "Sistema de agendamento com chatbot inteligente",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-512.png",
  },
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <Head>
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Minha Barbearia" />
      </Head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Cabecalho />

        {/* Reservando o espaço do cabeçalho fixo */}
        <main className="pt-[5vh]">
          {children}
        </main>
      </body>
    </html>
  );
}
