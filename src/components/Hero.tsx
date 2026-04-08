import { BlueprintGrid } from "@/components/BlueprintGrid";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-blueprint-line py-20 md:py-28">
      <BlueprintGrid className="opacity-35" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-blueprint-technical/10 blur-3xl"
      />
      <div className="container-shell relative">
        <div className="max-w-5xl">
          <p className="section-eyebrow mb-4">An open analytical project</p>
          <h1 className="mb-6 max-w-4xl font-display text-[var(--step-4)] leading-[1.05] tracking-tight text-ink">
            Building a public blueprint for systems that are more capable, more
            humane, and harder to capture.
          </h1>
          <p className="mb-8 max-w-3xl text-[var(--step-2)] leading-snug text-slate">
            If we wanted a society that was more capable, more humane, and more
            accountable, what would have to change first?
          </p>
          <p className="mb-10 reading-width text-[var(--step-0)] leading-relaxed text-slate">
            Civic Blueprint is an open attempt to understand why critical
            systems keep failing, what makes reform so difficult, and where
            better design might actually change outcomes. The framework already
            exists, but it is not presented here as settled truth. It is a
            working set of claims that needs outside pressure, domain expertise,
            and evidence strong enough to prove parts of it wrong.
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="#memo" className="primary-button">
              Read the first memo
            </a>
            <a href="#start-here" className="secondary-button">
              Start here
            </a>
            <a href="#contribute" className="secondary-button">
              Challenge this work
            </a>
          </div>
          <p className="mb-8 text-[var(--step--1)] text-muted">
            Start with one concrete example, then decide whether the broader
            framework is worth your time.
          </p>
          <div className="blueprint-panel max-w-3xl px-5 py-5 md:px-6 md:py-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-muted">
              Epistemic posture
            </p>
            <p className="text-[var(--step-0)] leading-relaxed text-slate">
              A working framework, not settled truth. Designed to be challenged.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
