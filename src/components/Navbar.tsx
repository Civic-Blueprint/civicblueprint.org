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
      <div className="container-shell flex items-center justify-between py-4">
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Civic Blueprint logo"
            width={36}
            height={36}
            priority
          />
          <span className="text-sm font-semibold tracking-wide text-ink">
            CIVIC BLUEPRINT
          </span>
        </a>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-5 text-sm text-slate">
            {navItems.map((item) => (
              <li key={item.label}>
                <a className="text-link no-underline" href={item.href}>
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
