import { DocsNavLink } from "@/components/DocsNavLink";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import type { DocSummary } from "@/lib/content";
import { getDocsNavigation } from "@/lib/content";

type DocsLayoutProps = {
  children: React.ReactNode;
};

function NavGroup({ docs, title }: { docs: DocSummary[]; title: string }) {
  if (docs.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        {title}
      </h2>
      <ul className="space-y-1.5">
        {docs.map((doc) => (
          <li key={doc.route}>
            <DocsNavLink href={doc.route}>{doc.title}</DocsNavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const navigation = await getDocsNavigation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 section-shell">
        <div className="container-shell">
          <div className="sticky top-28 z-10 mb-6 lg:hidden">
            <details id="docs-mobile-nav" className="blueprint-card p-3">
              <summary className="flex min-h-11 cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-semibold text-ink">
                Browse documents
              </summary>
              <nav className="mt-3 max-h-[calc(100dvh-12rem)] space-y-4 overflow-y-auto px-1 pb-2">
                <NavGroup docs={navigation.core} title="Core Documents" />
                <NavGroup docs={navigation.memos} title="Memos" />
                <NavGroup docs={navigation.process} title="Process" />
                <NavGroup docs={navigation.exchanges} title="Exchanges" />
              </nav>
            </details>
          </div>
          <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="blueprint-card sticky top-24 max-h-[calc(100dvh-8rem)] space-y-6 overflow-y-auto p-5">
                <NavGroup docs={navigation.core} title="Core Documents" />
                <NavGroup docs={navigation.memos} title="Memos" />
                <NavGroup docs={navigation.process} title="Process" />
                <NavGroup docs={navigation.exchanges} title="Exchanges" />
              </div>
            </aside>
            <div className="blueprint-card min-w-0 p-6 md:p-8">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
