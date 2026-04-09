import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  return (
    <article className="prose prose-blueprint w-full">
      <p className="doc-source-link">
        <a href={doc.githubUrl} target="_blank" rel="noreferrer">
          View this file on GitHub
        </a>
      </p>
      <p className="doc-source-path">{doc.sourcePath}</p>
      <div dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
