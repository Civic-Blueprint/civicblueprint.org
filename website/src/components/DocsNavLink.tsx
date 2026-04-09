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
    ? "block rounded-sm border-l-2 border-blueprint-navy bg-[rgba(25,64,138,0.08)] py-1 pl-3 text-sm font-semibold text-blueprint-navy"
    : "block rounded-sm border-l-2 border-transparent py-1 pl-3 text-sm text-slate transition-colors hover:border-blueprint-line hover:text-blueprint-navy";

  return (
    <Link
      href={href}
      className={className}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
