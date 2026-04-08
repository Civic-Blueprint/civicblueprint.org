export function WhyThisSite() {
  return (
    <section id="start-here" className="section-shell">
      <div className="container-shell">
        <p className="section-eyebrow mb-4">Site purpose</p>
        <h2 className="section-title mb-5 text-ink">Why This Site Exists</h2>
        <p className="mb-5 reading-width text-[var(--step-0)] leading-relaxed text-slate">
          The working documents live in{" "}
          <a
            href="https://github.com/Civic-Blueprint/project-2028"
            className="text-link"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          . That is useful for drafting and version history, and structured
          contribution.
        </p>
        <p className="mb-5 reading-width text-[var(--step-0)] leading-relaxed text-slate">
          It is not a reasonable front door for many of the people this project
          most needs:
        </p>
        <ul className="mb-5 list-disc space-y-2 pl-6 text-[var(--step-0)] text-slate">
          <li>domain experts</li>
          <li>public-interest operators</li>
          <li>policy-adjacent builders</li>
          <li>researchers with strong disagreement</li>
        </ul>
        <p className="mb-5 reading-width text-[var(--step-0)] leading-relaxed text-slate">
          This site exists to make the work legible enough for serious outsiders
          to challenge it without first learning a repository structure.
        </p>
        <p className="reading-width text-[var(--step-0)] leading-relaxed text-slate">
          The goal of this phase is not applause, branding, or broad awareness.
          It is to bring the framework into contact with serious outside
          critique, domain expertise, and evidence it does not yet have.
        </p>
      </div>
    </section>
  );
}
