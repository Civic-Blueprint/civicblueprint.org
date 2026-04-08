const usefulInputItems = [
  "Domain expertise from people who know how systems actually operate.",
  "Historical parallels that challenge or support key causal claims.",
  "Implementation critique on sequencing, incentives, staffing, and execution.",
  "Missing perspectives, especially beyond US and Western policy frames.",
  "Direct disagreement with major claims, including the institutional-capacity hypothesis.",
];

export function UsefulInput() {
  return (
    <section className="section-shell">
      <div className="container-shell">
        <p className="section-eyebrow mb-4">Feedback quality bar</p>
        <h2 className="section-title mb-5 text-ink">
          What Kind Of Input Is Most Useful
        </h2>
        <p className="mb-3 text-[var(--step-1)] font-semibold text-blueprint-navy">
          Encouragement is not the goal. Pressure is.
        </p>
        <p className="mb-8 reading-width text-[var(--step-0)] leading-relaxed text-muted">
          Helpful feedback is specific. Critique tied to causal claims,
          implementation details, or competing explanations is the most useful.
        </p>
        <div className="balanced-grid grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {usefulInputItems.map((item) => (
            <article key={item} className="blueprint-card p-6">
              <p className="text-[var(--step-0)] leading-relaxed text-slate">
                {item}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
