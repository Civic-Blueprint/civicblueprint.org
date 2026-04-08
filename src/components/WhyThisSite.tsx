export function WhyThisSite() {
  return (
    <section id="start-here" className="section-shell">
      <div className="container-shell">
        <h2 className="mb-5 font-display text-4xl text-ink">
          Why This Site Exists
        </h2>
        <p className="mb-5 reading-width text-lg text-slate">
          The working documents live in GitHub. That is useful for drafting and
          version history, but it is not a reasonable front door for many of the
          people this project most needs.
        </p>
        <ul className="mb-5 list-disc space-y-2 pl-6 text-slate">
          <li>Domain experts</li>
          <li>Public-interest operators</li>
          <li>Policy-adjacent builders</li>
          <li>Researchers with strong disagreement</li>
        </ul>
        <p className="reading-width text-slate">
          This site exists to make the work legible enough for serious outsiders
          to challenge it without first learning repository structure.
        </p>
      </div>
    </section>
  );
}
