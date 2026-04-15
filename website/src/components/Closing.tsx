export function Closing() {
  return (
    <section className="section-shell">
      <div className="container-shell">
        <div className="blueprint-panel max-w-4xl p-8 md:p-10">
          <p className="section-eyebrow mb-3">Closing</p>
          <p className="mb-3 text-[var(--step-0)] font-semibold text-slate">
            Your own founding texts already say this.
          </p>
          <h2 className="mb-6 max-w-[29ch] font-display text-[var(--step-2)] leading-[1.15] text-ink text-wrap-balance md:text-[var(--step-3)]">
            The question is whether we are ready to hold our systems
            accountable to the commitments we already claim to share.
          </h2>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="/evidence" className="primary-button w-full sm:w-auto">
              See the evidence
            </a>
            <a href="#memo" className="secondary-button w-full sm:w-auto">
              Read the memo
            </a>
          </div>
          <p className="max-w-3xl text-[var(--step--1)] leading-relaxed text-muted">
            Civic Blueprint exists to make that question harder to ignore.
          </p>
        </div>
      </div>
    </section>
  );
}
