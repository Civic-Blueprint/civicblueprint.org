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

  const imageUrl = "/og-default.png";

  return {
    title: `${doc.title} | Civic Blueprint`,
    description: doc.description,
    alternates: {
      canonical: doc.route,
    },
    openGraph: {
      title: `${doc.title} | Civic Blueprint`,
      description: doc.description,
      type: "article",
      url: doc.route,
      siteName: "Civic Blueprint",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${doc.title} | Civic Blueprint`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.title} | Civic Blueprint`,
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
            image: "https://civicblueprint.org/og-default.png",
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
