import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ResponseForm } from "@/components/ResponseForm";

const responsePaths = [
  {
    anchor: "challenge",
    title: "Challenge the directional claim",
    description:
      "Point directly to where the framework overreaches, misses causality, or draws the wrong strategic conclusion.",
    template: "challenge-claim.yml",
    queryType: "challenge",
  },
  {
    anchor: "expertise",
    title: "Share domain expertise",
    description:
      "Contribute practical or research knowledge from systems where you have direct experience.",
    template: "domain-expertise.yml",
    queryType: "domain-expertise",
  },
  {
    anchor: "historical",
    title: "Point to a historical case",
    description:
      "Add historical examples that support, complicate, or contradict framework claims.",
    template: "historical-case.yml",
    queryType: "historical-case",
  },
  {
    anchor: "perspective",
    title: "Suggest a missing perspective",
    description:
      "Identify stakeholders, contexts, or causal variables that the current work underweights.",
    template: "missing-perspective.yml",
    queryType: "missing-perspective",
  },
] as const;

export const metadata: Metadata = {
  title: "Respond | Civic Blueprint",
  description:
    "Choose how to challenge or contribute to Civic Blueprint. Submit through GitHub issue templates or use the plain submission form.",
  alternates: {
    canonical: "/respond",
  },
  openGraph: {
    title: "Respond to Civic Blueprint — Challenge or Contribute",
    description:
      "Choose how to challenge or contribute to Civic Blueprint. Submit through GitHub issue templates or use the plain submission form.",
    url: "/respond",
    type: "website",
    siteName: "Civic Blueprint",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Respond to Civic Blueprint — Challenge or Contribute",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Respond to Civic Blueprint — Challenge or Contribute",
    description:
      "Choose how to challenge or contribute to Civic Blueprint through GitHub or a plain form.",
    images: ["/og-default.jpg"],
  },
};

function issueTemplateUrl(template: string): string {
  return `https://github.com/Civic-Blueprint/project-2028/issues/new?template=${template}`;
}

export default function RespondPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="section-shell flex-1">
        <div className="container-shell space-y-8">
          <header className="max-w-3xl">
            <p className="section-eyebrow mb-3">Response paths</p>
            <h1 className="section-title mb-4 text-ink">How to respond</h1>
            <p className="leading-relaxed text-slate">
              Choose the path that matches your preference. If you are
              comfortable in GitHub, use an issue template. If you would rather
              send a plain message, use the form below and we will create a
              tracked issue for you.
            </p>
          </header>

          <div className="grid gap-5 md:grid-cols-2">
            {responsePaths.map((path) => (
              <section
                id={path.anchor}
                key={path.anchor}
                className="blueprint-card p-6"
              >
                <h2 className="mb-3 text-2xl leading-tight text-ink">
                  {path.title}
                </h2>
                <p className="mb-5 leading-relaxed text-slate">
                  {path.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    className="primary-button"
                    href={issueTemplateUrl(path.template)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Respond on GitHub
                  </a>
                  <Link
                    className="secondary-button"
                    href={`/respond?type=${path.queryType}#response-form`}
                  >
                    Use plain form
                  </Link>
                </div>
              </section>
            ))}
          </div>

          <Suspense
            fallback={
              <section id="response-form" className="blueprint-card p-6 md:p-8">
                <p className="text-slate">Loading response form...</p>
              </section>
            }
          >
            <ResponseForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
