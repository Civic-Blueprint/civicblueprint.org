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
          <h2 className="section-title mb-4 text-ink">
            The fastest way to evaluate this project is not to read every
            document.
          </h2>
          <p className="mb-5 section-lead">
            It is to test whether the framework can produce a better read of
            real bottlenecks than generic policy summaries can.
          </p>
          <p className="reading-width text-[var(--step-0)] leading-relaxed text-slate">
            That is why the first memo pairs two cases: housing permitting and
            AI governance.
          </p>
        </div>
        <article className="blueprint-panel corner-marks p-7 md:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Featured Artifact
          </p>
          <h3 className="mb-4 max-w-[24ch] font-display text-3xl leading-tight text-ink">
            Two Test Cases, One Framework: What Housing Permitting and AI
            Governance Reveal About Institutional Capacity
          </h3>
          <p className="mb-5 text-[var(--step-0)] leading-relaxed text-slate">
            AI governance is arguably the most urgent systemic challenge right
            now. Housing permitting is one of the most concrete. The memo
            applies the same analytical method to both and compares what they
            reveal together:
          </p>
          <div className="mb-6 border-t border-blueprint-line pt-4">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-muted">
              Key test questions
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate">
              <li>
                Where does institutional capacity show up as execution failure?
              </li>
              <li>Where does it show up as governance lag?</li>
              <li>
                What does the timescale difference between the two tell us about
                reform design?
              </li>
              <li>
                Is the framework actually pointing toward a better strategic
                direction than standard issue-specific analysis does?
              </li>
              <li>
                Where might the framework be overstating its case in each
                domain?
              </li>
            </ul>
          </div>
          <p className="mb-6 max-w-[52ch] text-[var(--step-0)] leading-relaxed text-slate">
            The memo is not just asking whether the comparison is interesting.
            It is asking whether the framework&apos;s directional claim holds
            up: that upstream institutional competence, matched to the speed and
            structure of the domain, may be one of the strongest places to look
            for real leverage.
          </p>
          <p className="mb-6 max-w-[52ch] text-[var(--step-0)] leading-relaxed text-slate">
            If that claim adds nothing to either conversation, the project needs
            to know that. If it clarifies something that single-domain analysis
            misses, that is a better basis for deeper engagement.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#" className="primary-button w-full sm:w-auto">
              Read the memo
            </a>
            <a href="#framework" className="secondary-button w-full sm:w-auto">
              See the source framework
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
