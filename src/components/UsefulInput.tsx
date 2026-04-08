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
        <h2 className="mb-5 font-display text-4xl text-ink">
          What Kind Of Input Is Most Useful
        </h2>
        <p className="mb-8 text-xl font-semibold text-blueprint-navy">
          Encouragement is not the goal. Pressure is.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {usefulInputItems.map((item) => (
            <article key={item} className="blueprint-card p-6">
              <p className="text-slate">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
