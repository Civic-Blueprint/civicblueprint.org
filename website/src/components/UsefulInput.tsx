const usefulInputItems = [
  "Domain expertise from people who know how a system actually works.",
  "Historical parallels that support or challenge the framework's causal claims.",
  "Implementation critique about sequencing, incentives, staffing, and execution.",
  "Missing perspectives, especially from outside US and Western policy frames.",
  "Direct disagreement with major claims, including the institutional-capacity hypothesis and the memo's directional claim about leverage.",
  "Formation-document expertise from constitutional scholars, comparative political theorists, and historians of founding texts.",
  "Challenges to the convergence claim itself, including selection bias, interpretive generosity, or false-overlap inflation.",
];

export function UsefulInput() {
  return (
    <section className="section-shell">
      <div className="container-shell">
        <p className="section-eyebrow mb-4">Feedback quality bar</p>
        <h2 className="section-title mb-5 text-ink">
          What Kind Of Input Is Most Useful
        </h2>
        <p className="mb-3 reading-width text-[var(--step-0)] leading-relaxed text-slate">
          This project is not mainly looking for encouragement. It is looking
          for pressure that improves the work.
        </p>
        <p className="mb-8 text-[var(--step-1)] font-semibold text-blueprint-navy">
          The most useful input includes:
        </p>
        <div className="balanced-grid grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {usefulInputItems.map((item) => (
            <article key={item} className="blueprint-card p-6">
              <p className="text-[var(--step-0)] leading-relaxed text-slate">
                {item}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-6 reading-width text-[var(--step-0)] leading-relaxed text-muted">
          Helpful feedback is specific. &quot;The convergence finding is
          interesting&quot; is less useful than &quot;the alignment you&apos;re
          reading in the African Union Act is better explained by X.&quot;
        </p>
      </div>
    </section>
  );
}
