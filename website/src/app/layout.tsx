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
  title: "Civic Blueprint | What if we already agree on where we're going?",
  description:
    "Across centuries and continents, human civilizations converge on the same commitments: dignity, accountability, freedom, and broad participation. Civic Blueprint surfaces that alignment, maps where systems drift from it, and invites challenge.",
  metadataBase: new URL("https://civicblueprint.org"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Civic Blueprint — What if we're not as divided as we think?",
    description:
      "Across centuries and continents, human civilizations converge on the same commitments. Explore the evidence, read the framework, and challenge the work.",
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
    title: "Civic Blueprint — What if we're not as divided as we think?",
    description:
      "See the evidence. Read the framework. Challenge the work.",
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
