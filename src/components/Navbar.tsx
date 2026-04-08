import Image from "next/image";

const navItems = [
  { href: "#start-here", label: "Start Here" },
  { href: "#memo", label: "Memo" },
  { href: "#framework", label: "Framework" },
  { href: "#contribute", label: "Contribute" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-blueprint-line bg-blueprint-surface/95 backdrop-blur">
      <div className="container-shell flex flex-wrap items-center justify-between gap-y-3 py-4">
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Civic Blueprint logo"
            width={40}
            height={40}
            className="rounded-lg"
            priority
          />
          <span className="text-sm font-semibold tracking-wide text-ink">
            CIVIC BLUEPRINT
          </span>
        </a>
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
          </ul>
        </nav>
      </div>
    </header>
  );
}
