import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-blueprint-line py-8">
      <div className="container-shell flex flex-col gap-3 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <a
          href="https://github.com/Civic-Blueprint"
          className="external-link font-medium text-slate transition-colors hover:text-blueprint-navy"
          target="_blank"
          rel="noreferrer"
        >
          Civic Blueprint
        </a>
        <div className="flex flex-wrap items-center gap-3">
          <p>Open framework under active challenge</p>
          <span aria-hidden="true" className="text-blueprint-line">
            |
          </span>
          <Link href="/privacy" className="text-link text-sm">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
