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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {contextCards.map((card) => (
            <article key={card} className="blueprint-card p-6">
              <p className="text-base text-slate">{card}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
