export function Footer() {
  return (
    <footer className="border-t border-blueprint-line py-8">
      <div className="container-shell flex flex-col gap-2 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <a
          href="https://github.com/Civic-Blueprint"
          className="font-medium text-slate transition-colors hover:text-blueprint-navy"
          target="_blank"
          rel="noreferrer"
        >
          Civic Blueprint
        </a>
        <p>Open framework under active challenge</p>
      </div>
    </footer>
  );
}
