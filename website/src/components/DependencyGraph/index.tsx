"use client";

import dynamic from "next/dynamic";

const DependencyGraphClient = dynamic(
  () => import("./DependencyGraph").then((module) => module.DependencyGraph),
  {
    ssr: false,
    loading: () => (
      <section className="not-prose my-8 rounded-xl border border-blueprint-line bg-white p-4 md:p-5">
        <p className="m-0 text-sm text-muted">
          Loading interactive dependency explorer...
        </p>
      </section>
    ),
  },
);

export function DependencyGraph() {
  return <DependencyGraphClient />;
}
