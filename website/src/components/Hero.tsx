import { BlueprintGrid } from "@/components/BlueprintGrid";
import Link from "next/link";

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
            What if we&apos;re not as divided as we think?
          </h1>
          <h2 className="section-lead mb-8 leading-snug text-slate text-wrap-balance">
            Across centuries, human civilizations keep reaching toward the same
            commitments: dignity, accountability, freedom, and broad
            participation. The methods differ. The outcomes they aspire to do
            not.
          </h2>
          <p className="mb-10 reading-width text-[var(--step-0)] leading-relaxed text-slate">
            Civic Blueprint assembled twenty-one formation documents spanning
            six continents and three centuries and mapped them against a shared
            set of principles. The pattern that emerged was convergence, not
            divergence. This is a working thesis backed by evidence, not a
            settled claim. It needs outside pressure, domain expertise, and
            challenges strong enough to prove parts of it wrong.
          </p>
          <p className="mb-8 reading-width rounded-lg border border-blueprint-line bg-blueprint-technical/10 px-4 py-3 text-[var(--step--1)] leading-relaxed text-slate">
            <span className="font-semibold text-ink">Project context:</span>{" "}
            most documents are developed through human-AI collaboration and
            steward editing, not published as raw model output.{" "}
            <Link
              href="/docs/content-provenance"
              className="font-semibold text-blueprint-navy underline decoration-2 decoration-blueprint-navy underline-offset-2 hover:text-blueprint-technical hover:decoration-blueprint-technical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-technical focus-visible:ring-offset-2"
            >
              See content provenance labels
            </Link>{" "}
            before diving into the memo.
          </p>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link href="/evidence" className="primary-button w-full sm:w-auto">
              See the evidence
            </Link>
            <a href="#memo" className="secondary-button w-full sm:w-auto">
              Read the first memo
            </a>
            <a href="#contribute" className="secondary-button w-full sm:w-auto">
              Challenge this work
            </a>
          </div>
          <p className="mb-8 text-[var(--step--1)] text-muted">
            Start with the finding. Then decide whether the framework behind it
            is worth your time.
          </p>
        </div>
      </div>
    </section>
  );
}
