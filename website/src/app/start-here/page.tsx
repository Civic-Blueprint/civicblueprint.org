import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const readingPaths = [
  {
    title: "If you have 10 minutes",
    steps: [
      { href: "/evidence", label: "Start with the evidence" },
      {
        href: "/docs/memos/proof-of-usefulness-memo-01",
        label: "Read the first memo",
      },
    ],
  },
  {
    title: "If you have 30 minutes",
    steps: [
      { href: "/evidence", label: "Read the evidence page" },
      { href: "/docs/principles", label: "Read the principles" },
      {
        href: "/docs/memos/proof-of-usefulness-memo-01",
        label: "Read the first memo",
      },
    ],
  },
  {
    title: "If you want the full arc",
    steps: [
      { href: "/evidence", label: "Read the evidence page" },
      { href: "/docs/principles", label: "Read the principles" },
      { href: "/docs/problem-map", label: "Read the problem map" },
      { href: "/docs/systems-framework", label: "Read the systems framework" },
    ],
  },
];

const orientationCards = [
  {
    title: "Evidence",
    description:
      "The formation-document corpus tests whether Civic Blueprint's principles are idiosyncratic or whether they reflect broader human convergence on outcome commitments.",
    href: "/evidence",
  },
  {
    title: "Principles",
    description:
      "The constitutional layer: shared outcome targets around dignity, accountable power, essential needs, ecology, justice, and openness to challenge.",
    href: "/docs/principles",
  },
  {
    title: "Problem Map",
    description:
      "The drift diagnostic: where systems fail, why they remain stuck, and how failures reinforce one another.",
    href: "/docs/problem-map",
  },
  {
    title: "Systems Framework",
    description:
      "The realignment layer: how the diagnosis plays out across domains and where leverage might exist.",
    href: "/docs/systems-framework",
  },
];

export const metadata: Metadata = {
  title: "Start Here | Civic Blueprint",
  description:
    "Get oriented to Civic Blueprint: start with the evidence, then move into the principles, problem map, systems framework, and the first memo.",
  alternates: {
    canonical: "/start-here",
  },
  openGraph: {
    title: "Start Here | Civic Blueprint",
    description:
      "Start with the evidence, then follow the reading path into the principles, problem map, systems framework, and first memo.",
    url: "/start-here",
    type: "website",
    siteName: "Civic Blueprint",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Start Here | Civic Blueprint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Start Here | Civic Blueprint",
    description:
      "A guided reading path into the evidence, principles, problem map, systems framework, and first memo.",
    images: ["/og-default.jpg"],
  },
};

export default function StartHerePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="section-shell border-t-0">
          <div className="container-shell space-y-8">
            <header className="max-w-4xl">
              <p className="section-eyebrow mb-3">Start here</p>
              <h1 className="section-title mb-5 text-ink">
                Start with the evidence, then test the framework.
              </h1>
              <p className="section-lead mb-5">
                Civic Blueprint is no longer introducing itself only as a reform
                framework. It is introducing itself as a project that surfaces
                shared outcome commitments, maps where systems drift from them,
                and tests what realignment would require.
              </p>
              <p className="reading-width text-[var(--step-0)] leading-relaxed text-slate">
                If you are new here, the shortest useful path is: see the
                convergence claim, inspect the evidence, read the principles,
                then decide whether the rest of the framework is worth your
                time.
              </p>
            </header>

            <section className="balanced-grid grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {orientationCards.map((card) => (
                <article key={card.title} className="blueprint-card p-7">
                  <h2 className="mb-3 font-display text-2xl text-ink">
                    {card.title}
                  </h2>
                  <p className="mb-4 text-[var(--step-0)] leading-relaxed text-slate">
                    {card.description}
                  </p>
                  <Link href={card.href} className="text-link">
                    Read this next
                  </Link>
                </article>
              ))}
            </section>
          </div>
        </section>

        <section className="section-shell">
          <div className="container-shell">
            <p className="section-eyebrow mb-4">Suggested reading paths</p>
            <div className="balanced-grid grid gap-5 md:grid-cols-3">
              {readingPaths.map((path) => (
                <article key={path.title} className="blueprint-panel p-7">
                  <h2 className="mb-4 font-display text-2xl text-ink">
                    {path.title}
                  </h2>
                  <ol className="space-y-3 pl-5 text-[var(--step-0)] leading-relaxed text-slate">
                    {path.steps.map((step, index) => (
                      <li key={step.href}>
                        {index + 1}.{" "}
                        <Link href={step.href} className="text-link">
                          {step.label}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell">
          <div className="container-shell max-w-4xl">
            <p className="section-eyebrow mb-4">Why this site exists</p>
            <h2 className="section-title mb-5 text-ink">
              GitHub is the source of record. It is not the only reasonable
              front door.
            </h2>
            <p className="mb-5 reading-width text-[var(--step-0)] leading-relaxed text-slate">
              The working documents live in GitHub because version history,
              source transparency, and structured contribution matter. But that
              is not a reasonable entry point for many of the people the project
              most needs: domain experts, public-interest operators,
              policy-adjacent builders, and researchers with strong
              disagreement.
            </p>
            <p className="reading-width text-[var(--step-0)] leading-relaxed text-slate">
              This site exists to make the work legible enough for serious
              outsiders to challenge it without first learning a repository
              structure. If you want the deepest source context, use the full
              `/docs` library on this site. If you want the shortest path to
              the current thesis, start with the evidence page and the first
              memo.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
