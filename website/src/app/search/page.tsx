import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SearchPageClient } from "@/components/SearchPageClient";

export const metadata: Metadata = {
  title: "Search | Civic Blueprint",
  description:
    "Search Civic Blueprint documents, formation evidence, proposals, process notes, and exchanges.",
  alternates: {
    canonical: "/search",
  },
};

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 section-shell">
        <section className="container-shell">
          <SearchPageClient />
        </section>
      </main>
      <Footer />
    </div>
  );
}
