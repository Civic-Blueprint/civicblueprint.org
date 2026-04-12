import type { Metadata } from "next";
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
  const isProblemMap = slug.join("/") === "problem-map";

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
          className="prose prose-blueprint blueprint-card min-w-0 w-full p-6 md:p-8"
          style={isProblemMap ? { maxWidth: "none" } : undefined}
        >
          <p className="doc-source-link">
            <a href={doc.githubUrl} target="_blank" rel="noreferrer">
              View this file on GitHub
            </a>
          </p>
          <p className="doc-source-path">{doc.sourcePath}</p>
          <div className="mb-6 xl:hidden">
            <TableOfContents entries={doc.toc} collapsible />
          </div>
          {isProblemMap ? <DependencyGraph /> : null}
          <div dangerouslySetInnerHTML={{ __html: doc.html }} />
        </article>

        <div className="hidden xl:block">
          <TableOfContents entries={doc.toc} className="sticky top-24" />
        </div>
      </div>
      <BackToTop />
    </>
  );
}
