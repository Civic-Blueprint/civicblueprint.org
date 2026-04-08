const responseOptions = [
  { title: "Challenge the directional claim", href: "#" },
  { title: "Share domain expertise", href: "#" },
  { title: "Read the contribution guide", href: "#" },
];

export function HowToRespond() {
  return (
    <section id="contribute" className="section-shell">
      <div className="container-shell">
        <h2 className="mb-5 font-display text-4xl text-ink">How To Respond</h2>
        <p className="mb-8 reading-width text-lg text-slate">
          If you think the framework is useful, incomplete, or wrong, say so
          directly.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {responseOptions.map((option) => (
            <a
              key={option.title}
              className="blueprint-card block p-7 transition-colors hover:border-blueprint-technical"
              href={option.href}
            >
              <h3 className="font-display text-2xl text-ink">{option.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
