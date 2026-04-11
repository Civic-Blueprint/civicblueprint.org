"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { HamburgerButton } from "@/components/HamburgerButton";
import { MobileDrawer } from "@/components/MobileDrawer";

type NavbarMobileMenuProps = {
  enabled?: boolean;
  docsContent?: ReactNode;
};

export function NavbarMobileMenu({
  enabled = false,
  docsContent,
}: NavbarMobileMenuProps) {
  if (!enabled) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleCloseRequest = () => {
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    window.addEventListener("docs-mobile-nav:close", handleCloseRequest);
    return () =>
      window.removeEventListener("docs-mobile-nav:close", handleCloseRequest);
  }, []);

  return (
    <div className="shrink-0 lg:hidden">
      <div className="flex justify-end">
        <HamburgerButton
          controls="mobile-navigation-drawer"
          expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          buttonRef={triggerRef}
        />
      </div>

      <MobileDrawer
        id="mobile-navigation-drawer"
        open={isOpen}
        labelledBy="mobile-navigation-heading"
        onClose={closeMenu}
        closeButtonRef={closeButtonRef}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2
              id="mobile-navigation-heading"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-muted"
            >
              Browse Documents
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-blueprint-line bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-blueprint-navy hover:text-blueprint-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-navy focus-visible:ring-offset-2"
              aria-label="Close navigation menu"
              onClick={closeMenu}
            >
              Close
            </button>
          </div>

          <div>{docsContent}</div>
        </div>
      </MobileDrawer>
    </div>
  );
}
