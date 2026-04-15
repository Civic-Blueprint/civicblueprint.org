"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { NavbarMobileMenu } from "@/components/NavbarMobileMenu";

const navItems = [
  { href: "/evidence", label: "Evidence" },
  { href: "/start-here", label: "Start Here" },
  { href: "/#framework", label: "Framework" },
  { href: "/#contribute", label: "Contribute" },
];

type NavbarProps = {
  mobileMenuEnabled?: boolean;
  mobileMenuContent?: ReactNode;
};

export function Navbar({
  mobileMenuEnabled = false,
  mobileMenuContent,
}: NavbarProps) {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const normalizedKey = event.key.toLowerCase();
      const shouldOpenSearch =
        normalizedKey === "k" && (event.metaKey === true || event.ctrlKey === true);
      if (shouldOpenSearch === false) {
        return;
      }

      event.preventDefault();
      router.push("/search");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [router]);

  return (
    <header className="sticky top-0 z-20 border-b border-blueprint-line bg-blueprint-surface/95 backdrop-blur">
      <div className="container-shell flex flex-wrap items-center justify-between gap-y-3 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-transparent.png"
            alt="Civic Blueprint logo"
            width={56}
            height={55}
            priority
          />
          <span className="text-sm font-semibold tracking-wide text-ink">
            CIVIC BLUEPRINT
          </span>
        </Link>
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/search"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-blueprint-line bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-blueprint-navy hover:text-blueprint-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-navy focus-visible:ring-offset-2"
            aria-label="Search documents"
            title="Search documents (Ctrl/⌘+K)"
          >
            <SearchIcon />
          </Link>
          <NavbarMobileMenu
            enabled={mobileMenuEnabled}
            docsContent={mobileMenuContent}
          />
        </div>
        <nav aria-label="Primary" className="w-full md:w-auto">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.78rem] text-slate sm:text-sm md:justify-end">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  className="border-b border-transparent py-1 font-medium text-slate transition-colors hover:border-blueprint-navy hover:text-blueprint-navy focus-visible:border-blueprint-navy focus-visible:text-blueprint-navy"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="hidden md:block">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-md border border-blueprint-line bg-white px-2.5 py-1.5 font-medium text-slate transition-colors hover:border-blueprint-navy hover:text-blueprint-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-navy focus-visible:ring-offset-2"
                title="Search documents (Ctrl/⌘+K)"
              >
                <SearchIcon />
                <span>Search docs</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
