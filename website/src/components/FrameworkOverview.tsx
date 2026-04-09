import Link from "next/link";

const frameworkCards = [
  {
    title: "Principles",
    source: "PRINCIPLES.md",
    href: "/docs/principles",
    description:
      "defines the project's commitments: dignity, access to essential needs, accountable power, democratic oversight of AI, public-interest governance of critical systems, and openness to challenge.",
  },
  {
    title: "Problem Map",
    source: "PROBLEM_MAP.md",
    href: "/docs/problem-map",
    description:
      "describes where systems are stuck, why they stay stuck, who benefits from the dysfunction, and how recursive failure can spread across domains.",
  },
  {
    title: "Systems Framework",
    source: "SYSTEMS_FRAMEWORK.md",
    href: "/docs/systems-framework",
    description:
      "applies that diagnosis across fourteen domains — including housing, AI governance, healthcare, infrastructure, democratic process, and institutional capacity. It focuses on bottlenecks, dependencies, leverage, failure modes, and sequence.",
  },
  {
    title: "Process",
    href: "/docs/process/adversarial-review-protocol",
    description:
      "The project also publishes its review methods. Its claims are meant to face adversarial review, coherence checks, and historical challenge rather than being treated as final answers.",
  },
];

export function FrameworkOverview() {
  return (
    <section id="framework" className="section-shell">
      <div className="container-shell">
        <p className="section-eyebrow mb-4">Framework overview</p>
        <h2 className="section-title mb-5 text-ink">
          What The Framework Currently Says
        </h2>
        <p className="section-lead mb-8">
          The current framework has three main layers and one process layer.
        </p>
        <div className="balanced-grid grid gap-5 md:grid-cols-2">
          {frameworkCards.map((card) => (
            <article key={card.title} className="blueprint-panel p-7">
              <h3 className="mb-3 font-display text-2xl text-ink">
                {card.title}
              </h3>
              <p className="text-[var(--step-0)] leading-relaxed text-slate">
                {card.source ? (
                  <>
                    <code className="doc-ref">{card.source}</code>{" "}
                  </>
                ) : null}
                {card.description}
              </p>
              <Link href={card.href} className="mt-4 inline-block text-link">
                Read more
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
