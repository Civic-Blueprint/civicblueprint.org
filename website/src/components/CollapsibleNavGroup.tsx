"use client";

import { usePathname } from "next/navigation";

import type { DocSummary } from "@/lib/content";

import { DocsNavLink } from "./DocsNavLink";

type CollapsibleNavGroupProps = {
  docs: DocSummary[];
  title: string;
  defaultOpen?: boolean;
  sectionRoutePrefix?: string;
};

export function CollapsibleNavGroup({
  docs,
  title,
  defaultOpen = false,
  sectionRoutePrefix,
}: CollapsibleNavGroupProps) {
  const pathname = usePathname();

  if (docs.length === 0) {
    return null;
  }

  const hasActiveDoc = docs.some((doc) => pathname === doc.route);
  const matchesSectionPrefix =
    sectionRoutePrefix !== undefined && pathname.startsWith(sectionRoutePrefix);
  const isOpen =
    defaultOpen === true ||
    hasActiveDoc === true ||
    matchesSectionPrefix === true;

  return (
    <details className="group" open={isOpen}>
      <summary className="mb-2 flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-muted [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span
          aria-hidden="true"
          className="text-[10px] transition-transform duration-150 group-open:rotate-90"
        >
          ▸
        </span>
      </summary>
      <ul className="space-y-1.5">
        {docs.map((doc) => (
          <li key={doc.route}>
            <DocsNavLink href={doc.route}>{doc.title}</DocsNavLink>
          </li>
        ))}
      </ul>
    </details>
  );
}
