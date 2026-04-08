const frameworkCards = [
  {
    title: "Principles",
    description:
      "Commitments around dignity, access to essential needs, accountable power, democratic AI oversight, and openness to challenge.",
  },
  {
    title: "Problem Map",
    description:
      "Where systems are stuck, why they remain stuck, who benefits from dysfunction, and how recursive failure spreads across domains.",
  },
  {
    title: "Systems Framework",
    description:
      "Application of the diagnosis across fourteen domains with attention to bottlenecks, dependencies, leverage, and sequence.",
  },
  {
    title: "Process",
    description:
      "A review method designed for adversarial critique, coherence checks, and historical challenge instead of fixed doctrine.",
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
          The current framework has three analytical layers and one process
          layer.
        </p>
        <div className="balanced-grid grid gap-5 md:grid-cols-2">
          {frameworkCards.map((card) => (
            <article key={card.title} className="blueprint-panel p-7">
              <h3 className="mb-3 font-display text-2xl text-ink">
                {card.title}
              </h3>
              <p className="text-[var(--step-0)] leading-relaxed text-slate">
                {card.description}
              </p>
              <a href="#" className="mt-4 inline-block text-link">
                Read more
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
