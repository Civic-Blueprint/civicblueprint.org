import type { Metadata } from "next";
import Link from "next/link";

import { getAllDocs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Project Documents | Civic Blueprint",
  description:
    "Read Civic Blueprint core documents, memos, process protocols, proposals, and exchanges in one searchable public archive.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Project Documents | Civic Blueprint",
    description:
      "Read Civic Blueprint core documents, memos, process protocols, proposals, and exchanges in one searchable public archive.",
    url: "/docs",
    type: "website",
    siteName: "Civic Blueprint",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Project Documents | Civic Blueprint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Documents | Civic Blueprint",
    description:
      "Read Civic Blueprint core documents, memos, process protocols, proposals, and exchanges in one searchable public archive.",
    images: ["/og-default.png"],
  },
};

export default async function DocsIndexPage() {
  const docs = await getAllDocs();

  return (
    <section>
      <p className="section-eyebrow mb-3">Documents</p>
      <h1 className="section-title mb-5 text-ink">Project Documents</h1>
      <p className="mb-6 text-(--step-0) leading-relaxed">
        These pages render the source markdown from project-2028 with internal
        links preserved for easier reading and navigation.
      </p>
      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc.route}>
            <Link href={doc.route} className="text-link">
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
