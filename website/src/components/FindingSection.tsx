import Link from "next/link";

export function FindingSection() {
  return (
    <section className="section-shell">
      <div className="container-shell grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <div>
          <p className="section-eyebrow mb-4">The finding</p>
          <h2 className="section-title mb-5 text-ink">
            Across centuries, the same commitments keep resurfacing.
          </h2>
          <p className="mb-5 reading-width text-[var(--step-0)] leading-relaxed text-slate">
            Civic Blueprint did not start by writing principles and then looking
            for agreement. It started with a question: if we wanted systems that
            were more capable, more humane, and more accountable, what would
            have to change first?
          </p>
          <p className="mb-5 reading-width text-[var(--step-0)] leading-relaxed text-slate">
            That question led to a harder one: are these commitments ours alone,
            or has humanity been reaching toward them all along? The
            formation-document analysis was built to answer that.
          </p>
          <p className="mb-5 reading-width text-[var(--step-0)] leading-relaxed text-slate">
            Twenty-one constitutions, charters, declarations, and organizational
            founding texts were mapped against seventeen outcome commitments. The
            pattern that emerged was convergence, not total consensus but a much
            broader overlap than surface political conflict suggests.
          </p>
          <p className="reading-width text-[var(--step-0)] leading-relaxed text-slate">
            This is not Civic Blueprint projecting its values onto the world. It
            is the world&apos;s stated commitments being surfaced, compared, and
            made legible.
          </p>
        </div>
        <aside className="blueprint-panel p-7">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted">
            What recurs
          </p>
          <ul className="space-y-3 text-[var(--step-0)] leading-relaxed text-slate">
            <li>Dignity appears in nearly every source family.</li>
            <li>Accountable and constrained power recur across the corpus.</li>
            <li>
              Participation, pluralism, and social provision appear in different
              forms across radically different traditions.
            </li>
            <li>
              The strongest disagreements are usually about methods, not whether
              human beings should live with dignity and accountability.
            </li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/evidence" className="primary-button w-full sm:w-auto">
              Explore the evidence
            </Link>
            <Link
              href="/docs/formation-docs/analysis/synthesis/alignment-matrix"
              className="secondary-button w-full sm:w-auto"
            >
              Read the matrix
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
