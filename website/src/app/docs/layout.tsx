import Link from "next/link";

import { CollapsibleNavGroup } from "@/components/CollapsibleNavGroup";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getDocsNavigation } from "@/lib/content";

type DocsLayoutProps = {
  children: React.ReactNode;
};

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const navigation = await getDocsNavigation();
  const mobileMenuContent = (
    <nav aria-label="Documents" className="space-y-4" data-pagefind-ignore>
      <Link
        href="/search"
        className="inline-flex min-h-11 w-full items-center justify-between rounded-md border border-blueprint-line bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-blueprint-navy hover:text-blueprint-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-navy focus-visible:ring-offset-2"
      >
        Search docs
        <span aria-hidden="true">⌘K</span>
      </Link>
      <CollapsibleNavGroup
        docs={navigation.core}
        title="Core Documents"
        defaultOpen
      />
      <CollapsibleNavGroup
        docs={navigation.synthesis}
        title="Synthesis"
        defaultOpen
        sectionRoutePrefix="/docs/formation-docs/analysis/synthesis"
      />
      <CollapsibleNavGroup
        docs={navigation.sourceAlignments}
        title="Source Alignments"
        sectionRoutePrefix="/docs/formation-docs/analysis/principle-maps"
      />
      <CollapsibleNavGroup docs={navigation.memos} title="Memos" />
      <CollapsibleNavGroup docs={navigation.proposals} title="Proposals" />
      <CollapsibleNavGroup docs={navigation.process} title="Process" />
      <CollapsibleNavGroup docs={navigation.exchanges} title="Exchanges" />
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar mobileMenuEnabled mobileMenuContent={mobileMenuContent} />
      <main className="flex-1 section-shell">
        <div className="container-shell">
          <div className="grid items-start gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div
                className="blueprint-card sticky top-24 max-h-[calc(100dvh-8rem)] space-y-6 overflow-y-auto p-5"
                data-pagefind-ignore
              >
                <Link
                  href="/search"
                  className="inline-flex min-h-11 w-full items-center justify-between rounded-md border border-blueprint-line bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-blueprint-navy hover:text-blueprint-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-navy focus-visible:ring-offset-2"
                >
                  Search docs
                  <span aria-hidden="true">⌘K</span>
                </Link>
                <CollapsibleNavGroup
                  docs={navigation.core}
                  title="Core Documents"
                  defaultOpen
                />
                <CollapsibleNavGroup
                  docs={navigation.synthesis}
                  title="Synthesis"
                  defaultOpen
                  sectionRoutePrefix="/docs/formation-docs/analysis/synthesis"
                />
                <CollapsibleNavGroup
                  docs={navigation.sourceAlignments}
                  title="Source Alignments"
                  sectionRoutePrefix="/docs/formation-docs/analysis/principle-maps"
                />
                <CollapsibleNavGroup docs={navigation.memos} title="Memos" />
                <CollapsibleNavGroup
                  docs={navigation.proposals}
                  title="Proposals"
                />
                <CollapsibleNavGroup
                  docs={navigation.process}
                  title="Process"
                />
                <CollapsibleNavGroup
                  docs={navigation.exchanges}
                  title="Exchanges"
                />
              </div>
            </aside>
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
