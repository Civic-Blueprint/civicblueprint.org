const contextCards = [
  "Systems are failing in predictable ways.",
  "AI is accelerating faster than governance.",
  "These problems are connected upstream.",
  "This project tests whether that changes reform strategy.",
];

export function QuickContext() {
  return (
    <section className="section-shell">
      <div className="container-shell">
        <p className="section-eyebrow mb-4">Quick context</p>
        <div className="balanced-grid grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {contextCards.map((card, index) => (
            <article key={card} className="blueprint-card p-6 md:p-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                Signal {index + 1}
              </p>
              <p className="text-[var(--step-0)] leading-relaxed text-slate">
                {card}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
