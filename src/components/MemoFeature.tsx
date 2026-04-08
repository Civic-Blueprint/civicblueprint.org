import { BlueprintGrid } from "@/components/BlueprintGrid";

export function MemoFeature() {
  return (
    <section id="memo" className="section-shell relative overflow-hidden">
      <BlueprintGrid className="opacity-30" />
      <div className="container-shell relative grid gap-8 lg:grid-cols-2">
        <div>
          <p className="section-eyebrow mb-3">
            Start With One Concrete Example
          </p>
          <h2 className="mb-4 font-display text-4xl text-ink">
            The fastest way to evaluate this project is to test one memo.
          </h2>
          <p className="reading-width text-lg text-slate">
            Instead of reading every document, start with a paired test case:
            housing permitting and AI governance. The question is whether one
            framework can generate better strategic insight across both domains.
          </p>
        </div>
        <article className="blueprint-panel corner-marks p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Featured Artifact
          </p>
          <h3 className="mb-4 font-display text-3xl text-ink">
            Two Test Cases, One Framework
          </h3>
          <ul className="mb-6 list-disc space-y-2 pl-5 text-slate">
            <li>Housing permitting as a slower systems case.</li>
            <li>AI governance as a fast-moving systems case.</li>
            <li>One method applied to both.</li>
          </ul>
          <div className="mb-6 border-t border-blueprint-line pt-4">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-muted">
              Key test questions
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate">
              <li>Where does institutional capacity break differently?</li>
              <li>What changes across governance timescales?</li>
              <li>Does this outperform standard issue analysis?</li>
            </ul>
          </div>
          <p className="mb-6 text-slate">
            Does this framework reveal leverage that issue-specific analysis
            misses, or is it overstating its case?
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#" className="primary-button">
              Read the memo
            </a>
            <a href="#framework" className="secondary-button">
              See the source framework
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
