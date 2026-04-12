import type { Metadata } from "next";
import { Public_Sans, Source_Serif_4 } from "next/font/google";

import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { JsonLd } from "@/components/JsonLd";

import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Civic Blueprint | A public framework for redesigning broken systems",
  description:
    "Civic Blueprint is an open project for understanding how critical systems fail and how they might be redesigned. Read the first proof-of-usefulness memo — housing permitting and AI governance through one framework — explore the work, and challenge it.",
  metadataBase: new URL("https://civicblueprint.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Civic Blueprint | A public framework for redesigning broken systems",
    description:
      "Civic Blueprint is an open project for understanding how critical systems fail and how they might be redesigned.",
    type: "website",
    siteName: "Civic Blueprint",
    locale: "en_US",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Civic Blueprint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Civic Blueprint | A public framework for redesigning broken systems",
    description:
      "Read the first proof-of-usefulness memo, explore the framework, and challenge the work.",
    images: ["/og-default.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Civic Blueprint",
            url: "https://civicblueprint.org",
            logo: "https://civicblueprint.org/logo.png",
          }}
        />
        {children}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
