import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BackToTop } from "@/components/BackToTop";
import { DependencyGraph } from "@/components/DependencyGraph";
import { JsonLd } from "@/components/JsonLd";
import { TableOfContents } from "@/components/TableOfContents";
import { getAllDocs, getDocBySlug } from "@/lib/content";

type DocPageProps = {
  params: Promise<{ slug: string[] }>;
};

const SOCIAL_MIN = 50;
const SOCIAL_MAX = 60;

type FramingCard = {
  eyebrow: string;
  title: string;
  description: string;
};

function truncateAtWord(text: string, max: number, min = 0): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const last = cut.lastIndexOf(" ");
  return last >= min ? cut.slice(0, last) : cut;
}

function buildSocialTitle(title: string, description: string): string {
  const branded = `${title} | Civic Blueprint`;
  if (branded.length >= SOCIAL_MIN && branded.length <= SOCIAL_MAX) {
    return branded;
  }

  if (title.length >= SOCIAL_MIN) {
    return truncateAtWord(title, SOCIAL_MAX);
  }

  if (description.length > 0) {
    const combined = `${title} — ${description}`;
    if (combined.length <= SOCIAL_MAX) return combined;
    return truncateAtWord(combined, SOCIAL_MAX, SOCIAL_MIN);
  }

  return branded;
}

function getDocFraming(slug: string[]): FramingCard | null {
  const joinedSlug = slug.join("/");

  if (joinedSlug === "principles") {
    return {
      eyebrow: "Reading context",
      title: "How to use the Principles",
      description:
        "Read this as an outcome-level baseline, not as a policy blueprint. These principles define what a better system should deliver; the evidence corpus is used to test whether these commitments are broadly shared or merely project-specific.",
    };
  }

  if (joinedSlug === "problem-map") {
    return {
      eyebrow: "Reading context",
      title: "How to use the Problem Map",
      description:
        "Read this as a drift diagnostic. Each section identifies where systems fail to meet stated commitments, what reinforces that failure, and which feedback loops keep the problem in place.",
    };
  }

  if (joinedSlug === "systems-framework") {
    return {
      eyebrow: "Reading context",
      title: "How to use the Systems Framework",
      description:
        "Read this after the Problem Map. It translates diagnosis into domain-by-domain analysis focused on leverage, dependencies, bottlenecks, and sequence for realignment.",
    };
  }

  return null;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const docs = await getAllDocs();
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) {
    return {
      title: "Document not found | Civic Blueprint",
    };
  }

  const imageUrl = "/og-default.jpg";
  const shortTitle = `${doc.title} | Civic Blueprint`;
  const socialTitle = buildSocialTitle(doc.title, doc.description);

  return {
    title: shortTitle,
    description: doc.description,
    alternates: {
      canonical: doc.route,
    },
    openGraph: {
      title: socialTitle,
      description: doc.description,
      type: "article",
      url: doc.route,
      siteName: "Civic Blueprint",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: shortTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: doc.description,
      images: [imageUrl],
    },
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);
  const joinedSlug = slug.join("/");
  const isProblemMap = joinedSlug === "problem-map";
  const isSynthesisDoc = joinedSlug.startsWith("formation-docs/analysis/synthesis/");
  const isWideDocLayout = isProblemMap || isSynthesisDoc;
  const docFraming = getDocFraming(slug);

  if (!doc) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: doc.title,
            description: doc.description,
            url: `https://civicblueprint.org${doc.route}`,
            mainEntityOfPage: `https://civicblueprint.org${doc.route}`,
            publisher: {
              "@type": "Organization",
              name: "Civic Blueprint",
              logo: {
                "@type": "ImageObject",
                url: "https://civicblueprint.org/logo.png",
              },
            },
            image: "https://civicblueprint.org/og-default.jpg",
            dateModified: doc.lastModified.toISOString(),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://civicblueprint.org/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Documents",
                item: "https://civicblueprint.org/docs",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: doc.title,
                item: `https://civicblueprint.org${doc.route}`,
              },
            ],
          },
        ]}
      />
      <div className="docs-content-grid xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-6">
        <article
          className={`prose prose-blueprint blueprint-card min-w-0 w-full p-6 md:p-8 ${isSynthesisDoc ? "docs-wide-content" : ""}`}
          style={isWideDocLayout ? { maxWidth: "none" } : undefined}
          data-pagefind-body
        >
          <div className="sr-only" aria-hidden="true">
            <span data-pagefind-meta={`title:${doc.title}`} />
            <span data-pagefind-meta={`category:${doc.category}`} />
            <span data-pagefind-meta={`sourcePath:${doc.sourcePath}`} />
            <span data-pagefind-filter={`category:${doc.category}`} />
          </div>
          <p className="doc-source-link" data-pagefind-ignore>
            <a href={doc.githubUrl} className="external-link" target="_blank" rel="noreferrer">
              View this file on GitHub
            </a>
          </p>
          <p className="doc-source-path" data-pagefind-ignore>{doc.sourcePath}</p>
          {doc.provenance ? (
            <p className="doc-provenance" data-pagefind-ignore>
              <span className="doc-provenance-label">Provenance:</span>{" "}
              <code>{doc.provenance}</code>.{" "}
              <Link
                href="/docs/content-provenance"
                className="font-semibold text-blueprint-navy underline decoration-2 decoration-blueprint-navy underline-offset-2 hover:text-blueprint-technical hover:decoration-blueprint-technical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-technical focus-visible:ring-offset-2"
              >
                How Civic Blueprint labels human and AI collaboration
              </Link>
              .
            </p>
          ) : null}
          {docFraming ? (
            <section
              className="mb-6 rounded-xl border border-blueprint-line bg-blueprint-technical/10 p-5"
              data-pagefind-ignore
            >
              <p className="section-eyebrow mb-2">{docFraming.eyebrow}</p>
              <h2 className="mb-2 font-display text-2xl text-ink">
                {docFraming.title}
              </h2>
              <p className="m-0 text-(--step--1) leading-relaxed">
                {docFraming.description}
              </p>
            </section>
          ) : null}
          <div className="mb-6 xl:hidden" data-pagefind-ignore>
            <TableOfContents entries={doc.toc} collapsible />
          </div>
          {isProblemMap ? <DependencyGraph /> : null}
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </article>

        <div className="hidden xl:block" data-pagefind-ignore>
          <TableOfContents entries={doc.toc} className="sticky top-24" />
        </div>
      </div>
      <BackToTop />
    </>
  );
}
