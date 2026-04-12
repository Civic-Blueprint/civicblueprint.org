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
  const mobileMenuContent = (
    <nav aria-label="Documents" className="space-y-4">
      <NavGroup docs={navigation.core} title="Core Documents" />
      <NavGroup docs={navigation.memos} title="Memos" />
      <NavGroup docs={navigation.proposals} title="Proposals" />
      <NavGroup docs={navigation.process} title="Process" />
      <NavGroup docs={navigation.exchanges} title="Exchanges" />
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar mobileMenuEnabled mobileMenuContent={mobileMenuContent} />
      <main className="flex-1 section-shell">
        <div className="container-shell">
          <div className="grid items-start gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="blueprint-card sticky top-24 max-h-[calc(100dvh-8rem)] space-y-6 overflow-y-auto p-5">
                <NavGroup docs={navigation.core} title="Core Documents" />
                <NavGroup docs={navigation.memos} title="Memos" />
                <NavGroup docs={navigation.proposals} title="Proposals" />
                <NavGroup docs={navigation.process} title="Process" />
                <NavGroup docs={navigation.exchanges} title="Exchanges" />
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
