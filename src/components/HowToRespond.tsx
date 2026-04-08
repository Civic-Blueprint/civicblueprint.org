const responseOptions = [
  { title: "Challenge the directional claim", href: "#" },
  { title: "Share domain expertise", href: "#" },
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
        <div className="grid gap-5 md:grid-cols-3">
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
      </div>
    </section>
  );
}
