import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const summaryStats = [
  { label: "Documents", value: "21" },
  { label: "Source families", value: "4" },
  { label: "Continents", value: "6" },
  { label: "Centuries", value: "3" },
  { label: "Principles tested", value: "17" },
];

const sourceFamilies = [
  {
    title: "Nation-states",
    description:
      "Constitutions and founding rights texts from the United States, South Africa, Canada, India, Germany, France, Japan, and Brazil.",
  },
  {
    title: "U.S. states",
    description:
      "California, Massachusetts, Montana, and Texas provide a narrower constitutional layer with sharper contrasts around rights, constraints, and public obligations.",
  },
  {
    title: "International bodies",
    description:
      "The UDHR, UN Charter, EU Charter, and African Union Constitutive Act test how shared commitments travel beyond a single nation-state frame.",
  },
  {
    title: "Organizations",
    description:
      "Mondragon, the ICA cooperative identity, and the B Corp declaration show how constitutional thinking appears inside institutional and economic design.",
  },
];

const convergenceHighlights = [
  {
    title: "Dignity recurs",
    description:
      "Dignity appears directly or adjacent to it in nearly every source family, from rights charters to organizational constitutions.",
  },
  {
    title: "Power must answer",
    description:
      "Constrained, accountable, and reviewable power is one of the strongest patterns across the entire corpus.",
  },
  {
    title: "Participation matters",
    description:
      "Representation, civic standing, pluralism, and broad participation recur even where the institutional forms differ dramatically.",
  },
  {
    title: "Methods diverge more than ends",
    description:
      "The surface-level disagreements are often about implementation and institutional design, not whether people deserve dignity and accountable governance.",
  },
];

const tensionCards = [
  {
    title: "The overlap is broad, not total",
    description:
      "The corpus supports a convergence claim, but not a claim that everyone agrees on everything or that every source maps cleanly onto every principle.",
  },
  {
    title: "Some commitments are thinly represented",
    description:
      "Peace, civic formation, and stronger social-rights language recur in the corpus more clearly than the current principles name them.",
  },
  {
    title: "Some Civic Blueprint principles are genuine outliers",
    description:
      "AI governance, biosphere framing, and open moral consideration are more explicit in Civic Blueprint than in most of the historical corpus.",
  },
];

const evidenceLinks = [
  {
    title: "Alignment matrix",
    href: "/docs/formation-docs/analysis/synthesis/alignment-matrix",
    description:
      "See the cross-source summary of strongest overlaps, absences, and distinctive contributions.",
  },
  {
    title: "Gap analysis",
    href: "/docs/formation-docs/analysis/synthesis/gap-analysis",
    description:
      "Read where the corpus challenges, extends, or complicates the current principles.",
  },
  {
    title: "Uniqueness report",
    href: "/docs/formation-docs/analysis/synthesis/uniqueness-report",
    description:
      "Track where Civic Blueprint is more explicit or more unusual than the comparative corpus.",
  },
  {
    title: "Source registry",
    href: "/docs/formation-docs/source-registry",
    description:
      "Browse the full corpus and the canonical source locations in external-formation-docs.",
  },
];

export const metadata: Metadata = {
  title: "The Evidence | Civic Blueprint",
  description:
    "Browse the formation-document corpus behind Civic Blueprint's convergence claim: 21 documents, 4 source families, 6 continents, and the synthesis artifacts that compare them.",
  alternates: {
    canonical: "/evidence",
  },
  openGraph: {
    title: "The Evidence | Civic Blueprint",
    description:
      "See the formation-document corpus, alignment matrix, gap analysis, and uniqueness report behind Civic Blueprint's convergence claim.",
    url: "/evidence",
    type: "website",
    siteName: "Civic Blueprint",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "The Evidence | Civic Blueprint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Evidence | Civic Blueprint",
    description:
      "See the formation-document corpus and synthesis artifacts behind Civic Blueprint's convergence claim.",
    images: ["/og-default.jpg"],
  },
};

export default function EvidencePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="section-shell border-t-0">
          <div className="container-shell space-y-8">
            <header className="max-w-4xl">
              <p className="section-eyebrow mb-3">The evidence</p>
              <h1 className="section-title mb-5 text-ink">
                The convergence claim needs to be inspectable, not just stated.
              </h1>
              <p className="section-lead mb-5">
                This page summarizes the formation-document corpus behind the
                Phase 2 narrative. It shows what was compared, what patterns
                recur, where the evidence is strongest, and where the corpus
                complicates Civic Blueprint&apos;s current principles.
              </p>
              <p className="reading-width text-[var(--step-0)] leading-relaxed text-slate">
                The point is not to pretend every source says the same thing. It
                is to make overlap, divergence, silence, and genuine novelty
                legible enough to challenge.
              </p>
            </header>

            <section className="balanced-grid grid gap-5 md:grid-cols-3 xl:grid-cols-5">
              {summaryStats.map((stat) => (
                <article key={stat.label} className="blueprint-panel p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    {stat.label}
                  </p>
                  <p className="font-display text-4xl leading-none text-ink">
                    {stat.value}
                  </p>
                </article>
              ))}
            </section>
          </div>
        </section>

        <section className="section-shell">
          <div className="container-shell">
            <p className="section-eyebrow mb-4">What is in the corpus</p>
            <div className="balanced-grid grid gap-5 md:grid-cols-2">
              {sourceFamilies.map((family) => (
                <article key={family.title} className="blueprint-card p-7">
                  <h2 className="mb-3 font-display text-2xl text-ink">
                    {family.title}
                  </h2>
                  <p className="text-[var(--step-0)] leading-relaxed text-slate">
                    {family.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="container-shell">
            <p className="section-eyebrow mb-4">What recurs</p>
            <div className="balanced-grid grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {convergenceHighlights.map((item) => (
                <article key={item.title} className="blueprint-panel p-7">
                  <h2 className="mb-3 font-display text-2xl text-ink">
                    {item.title}
                  </h2>
                  <p className="text-[var(--step-0)] leading-relaxed text-slate">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="container-shell grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
            <div>
              <p className="section-eyebrow mb-4">What the evidence does not say</p>
              <h2 className="section-title mb-5 text-ink">
                Convergence is real. Uniformity is not.
              </h2>
              <p className="mb-5 reading-width text-[var(--step-0)] leading-relaxed text-slate">
                The corpus does not show that all traditions agree on everything.
                It shows something more disciplined and more useful: outcome-level
                overlap is much broader than day-to-day political conflict makes
                visible, while method-level divergence remains real and often
                consequential.
              </p>
              <p className="reading-width text-[var(--step-0)] leading-relaxed text-slate">
                The synthesis artifacts below make that distinction inspectable.
                They show overlap, absences, gaps, and the places where Civic
                Blueprint goes beyond the historical record.
              </p>
            </div>
            <div className="space-y-5">
              {tensionCards.map((card) => (
                <article key={card.title} className="blueprint-card p-6">
                  <h3 className="mb-3 font-display text-2xl text-ink">
                    {card.title}
                  </h3>
                  <p className="text-[var(--step-0)] leading-relaxed text-slate">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="container-shell">
            <p className="section-eyebrow mb-4">Read the underlying documents</p>
            <div className="balanced-grid grid gap-5 md:grid-cols-2">
              {evidenceLinks.map((link) => (
                <article key={link.title} className="blueprint-card p-7">
                  <h2 className="mb-3 font-display text-2xl text-ink">
                    {link.title}
                  </h2>
                  <p className="mb-4 text-[var(--step-0)] leading-relaxed text-slate">
                    {link.description}
                  </p>
                  <Link href={link.href} className="text-link">
                    Open document
                  </Link>
                </article>
              ))}
            </div>
            <p className="mt-6 reading-width text-[var(--step-0)] leading-relaxed text-slate">
              The full source corpus lives in{" "}
              <a
                href="https://github.com/Civic-Blueprint/external-formation-docs"
                className="text-link"
                target="_blank"
                rel="noreferrer"
              >
                external-formation-docs
              </a>
              . The analysis and synthesis layer lives here in the public site
              and in the Project 2028 repository.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
