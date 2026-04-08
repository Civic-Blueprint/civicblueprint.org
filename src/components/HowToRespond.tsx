const responseOptions = [
  { title: "Challenge the directional claim", href: "#" },
  { title: "Share domain expertise", href: "#" },
  { title: "Point to a historical case", href: "#" },
  { title: "Suggest a missing perspective", href: "#" },
  { title: "Read the contribution guide", href: "#" },
];

export function HowToRespond() {
  return (
    <section id="contribute" className="section-shell">
      <div className="container-shell">
        <p className="section-eyebrow mb-4">Response paths</p>
        <h2 className="section-title mb-5 text-ink">How To Respond</h2>
        <p className="section-lead mb-8">
          If you think the framework is useful, incomplete, or wrong, say so
          directly.
        </p>
        <p className="mb-5 text-[var(--step-0)] font-semibold text-blueprint-navy">
          Suggested response paths:
        </p>
        <div className="balanced-grid grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {responseOptions.map((option) => (
            <a
              key={option.title}
              className="blueprint-panel block p-7 transition-colors hover:border-blueprint-technical"
              href={option.href}
            >
              <h3 className="max-w-[16ch] font-display text-2xl leading-tight text-ink">
                {option.title}
              </h3>
            </a>
          ))}
        </div>
        <p className="mt-6 reading-width text-[var(--step-0)] leading-relaxed text-slate">
          The contribution path should work for both GitHub users and people who
          would rather send a plain message first.
        </p>
      </div>
    </section>
  );
}
