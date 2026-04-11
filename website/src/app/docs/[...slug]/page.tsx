import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackToTop } from "@/components/BackToTop";
import { DependencyGraph } from "@/components/DependencyGraph";
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
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.title} | Civic Blueprint`,
      description: doc.description,
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
