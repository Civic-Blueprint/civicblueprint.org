import Link from "next/link";

import { getAllDocs } from "@/lib/content";

export default async function DocsIndexPage() {
  const docs = await getAllDocs();

  return (
    <section>
      <p className="section-eyebrow mb-3">Documents</p>
      <h1 className="section-title mb-5 text-ink">Project Documents</h1>
      <p className="mb-6 text-[var(--step-0)] leading-relaxed text-slate">
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
