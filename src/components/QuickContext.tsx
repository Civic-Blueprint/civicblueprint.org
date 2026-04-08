const contextCards = [
  "Critical systems are failing in ways people can already feel.",
  "AI is accelerating faster than governance.",
  "Many of these failures share the same underlying causes.",
  "If the diagnosis is right, we may be trying to fix the wrong things first.",
];

export function QuickContext() {
  return (
    <section className="section-shell">
      <div className="container-shell">
        <p className="section-eyebrow mb-4">Quick context</p>
        <div className="balanced-grid grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {contextCards.map((card, index) => (
            <article key={card} className="blueprint-panel p-6 md:p-7">
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
