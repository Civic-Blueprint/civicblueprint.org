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
          <h1 className="section-title mb-5 text-ink text-wrap-balance">
            If we wanted a society that was more capable, more humane, and more
            accountable, what would have to change first?
          </h1>
          <h2 className="section-lead mb-8 leading-snug text-slate text-wrap-balance">
            Better systems are possible -- and building them is a shared civic
            responsibility.
          </h2>
          <p className="mb-10 reading-width text-[var(--step-0)] leading-relaxed text-slate">
            Civic Blueprint is an open attempt to understand why critical
            systems keep failing, what makes reform so difficult, and where
            better design might actually change outcomes. The framework already
            exists, but it is not presented here as settled truth. It is a
            working set of claims that needs outside pressure, domain expertise,
            and evidence strong enough to prove parts of it wrong.
          </p>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a href="#memo" className="primary-button w-full sm:w-auto">
              Read the first memo
            </a>
            <a href="#start-here" className="secondary-button w-full sm:w-auto">
              Start here
            </a>
            <a href="#contribute" className="secondary-button w-full sm:w-auto">
              Challenge this work
            </a>
          </div>
          <p className="mb-8 text-[var(--step--1)] text-muted">
            Start with one concrete example, then decide whether the broader
            framework is worth your time.
          </p>
        </div>
      </div>
    </section>
  );
}
