import Link from "next/link";

export function GapSection() {
  return (
    <section className="section-shell">
      <div className="container-shell">
        <p className="section-eyebrow mb-4">The gap</p>
        <h2 className="section-title mb-5 text-ink">
          If these commitments are shared, why don&apos;t our systems reflect them?
        </h2>
        <p className="section-lead mb-5">
          The problem is not that people disagree on dignity. The problem is
          that systems optimized for other objectives drift away from the
          commitments their own societies already say they hold.
        </p>
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="blueprint-card p-6">
            <h3 className="mb-3 font-display text-2xl text-ink">Housing</h3>
            <p className="text-[var(--step-0)] leading-relaxed text-slate">
              Scarcity persists where foundational texts point toward stability,
              public accountability, and broad access.
            </p>
          </article>
          <article className="blueprint-card p-6">
            <h3 className="mb-3 font-display text-2xl text-ink">AI</h3>
            <p className="text-[var(--step-0)] leading-relaxed text-slate">
              Capability accelerates faster than governance, creating a widening
              gap between public-interest commitments and institutional capacity.
            </p>
          </article>
          <article className="blueprint-card p-6">
            <h3 className="mb-3 font-display text-2xl text-ink">
              Public trust
            </h3>
            <p className="text-[var(--step-0)] leading-relaxed text-slate">
              Institutions lose legitimacy when they deliver theater instead of
              visible competence.
            </p>
          </article>
        </div>
        <p className="mt-6 reading-width text-[var(--step-0)] leading-relaxed text-slate">
          Civic Blueprint exists to map that drift and test whether
          understanding it changes what closing the gap looks like. For readers
          who want the full diagnostic, the{" "}
          <Link href="/docs/problem-map" className="text-link">
            Problem Map
          </Link>{" "}
          remains the source document.
        </p>
      </div>
    </section>
  );
}
