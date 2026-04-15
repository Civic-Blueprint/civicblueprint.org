const contextCards = [
  {
    title: "Shared commitments",
    body: "Dignity, accountability, and constrained power appear in founding texts across centuries and continents.",
  },
  {
    title: "Convergence, not coincidence",
    body: "Twenty-one documents, six continents, three centuries: the same aspirations keep resurfacing.",
  },
  {
    title: "The gap",
    body: "If these commitments are shared, why don't our systems reflect them?",
  },
  {
    title: "The work",
    body: "Not to invent new values. To surface the alignment that already exists and close the gap.",
  },
];

export function QuickContext() {
  return (
    <section className="section-shell">
      <div className="container-shell">
        <p className="section-eyebrow mb-4">Quick context</p>
        <div className="balanced-grid grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {contextCards.map((card) => (
            <article key={card.title} className="blueprint-panel p-6 md:p-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                {card.title}
              </p>
              <p className="text-[var(--step-0)] leading-relaxed text-slate">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
