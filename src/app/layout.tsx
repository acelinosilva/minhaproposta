import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans", // keep the CSS var name so globals.css still works
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PropostaAI // Automação Comercial Inteligente com IA",
    template: "%s | PropostaAI"
  },
  description: "Crie propostas comerciais de alto impacto em segundos. Nossa IA ajuda freelancers e agências a transformarem orçamentos em documentos persuasivos.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://minhaproposta-ecru.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PropostaAI // Automação Comercial Inteligente',
    description: 'Crie propostas comerciais de alto impacto em segundos com IA.',
    url: '/',
    siteName: 'PropostaAI',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropostaAI // Automação Comercial Inteligente',
    description: 'Crie propostas comerciais de alto impacto em segundos com IA.',
  },
  keywords: ['proposta comercial', 'gerador de propostas', 'inteligência artificial', 'automação de vendas', 'freelancer', 'agência digital', 'copywriting'],
  verification: {
    google: 'ozQtHOPAWC45ktZNpYunFDoB8dn2ZNKoGE9poIdDU6g',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
