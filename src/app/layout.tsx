import type { Metadata } from "next";
import { Zalando_Sans, Zalando_Sans_Expanded } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const zalando = Zalando_Sans({ subsets: ["latin"], variable: "--font-zalando", display: "swap" });
const zalandoX = Zalando_Sans_Expanded({ subsets: ["latin"], variable: "--font-zalando-x", display: "swap" });

export const metadata: Metadata = {
  title: "Mirllém Tássia | Arquitetura & Engenharia Aplicada",
  description:
    "Portfólio da engenheira Mirllém Tássia, de Juazeiro do Norte (CE): projetos residenciais, construção financiada, perícias, fachadas e engenharia diagnóstica. +30 mil m² projetados.",
  openGraph: {
    title: "Mirllém Tássia | Arquitetura & Engenharia Aplicada",
    description: "Projetos, construção financiada e perícias no Cariri. Obra sem complicação.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${zalando.variable} ${zalandoX.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
