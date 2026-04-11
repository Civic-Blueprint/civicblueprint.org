"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

type DocsNavLinkProps = {
  children: ReactNode;
  href: string;
};

export function DocsNavLink({ children, href }: DocsNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const className = isActive
    ? "block rounded-md border border-blueprint-line bg-[rgba(25,64,138,0.08)] px-3 py-2 text-sm font-semibold text-blueprint-navy"
    : "block rounded-md border border-transparent px-3 py-2 text-sm text-slate transition-colors hover:border-blueprint-line hover:text-blueprint-navy focus-visible:border-blueprint-navy focus-visible:outline-none";

  return (
    <Link
      href={href}
      className={className}
      aria-current={isActive ? "page" : undefined}
      onClick={() => {
        window.dispatchEvent(new Event("docs-mobile-nav:close"));
      }}
    >
      {children}
    </Link>
  );
}
