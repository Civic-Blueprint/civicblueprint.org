export function WhyThisExists() {
  return (
    <section className="section-shell">
      <div className="container-shell">
        <p className="section-eyebrow mb-4">Project premise</p>
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="section-title mb-5 text-ink">Why This Exists</h2>
            <p className="section-lead mb-5">
              Too many essential systems are harder to use, slower to improve,
              and easier to capture than they should be.
            </p>
            <p className="reading-width text-[var(--step-0)] leading-relaxed text-slate">
              These problems are usually treated as separate policy debates. The
              Civic Blueprint framework argues they are connected, often through
              the same upstream failures in institutional capacity, democratic
              accountability, and the ability of public systems to execute at
              the speed the moment demands.
            </p>
          </div>
          <div className="blueprint-card p-6 lg:col-span-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Everyday signs
            </p>
            <ul className="list-disc space-y-2.5 pl-5 text-[var(--step-0)] text-slate">
              <li>Housing is scarce where it should be abundant.</li>
              <li>Healthcare is rationed by price and complexity.</li>
              <li>AI is moving faster than governance can keep pace.</li>
              <li>Public trust erodes when institutions cannot deliver.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
