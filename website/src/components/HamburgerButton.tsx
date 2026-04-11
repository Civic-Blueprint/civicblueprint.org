"use client";

import type { RefObject } from "react";

type HamburgerButtonProps = {
  controls: string;
  expanded: boolean;
  onClick: () => void;
  buttonRef?: RefObject<HTMLButtonElement | null>;
};

export function HamburgerButton({
  controls,
  expanded,
  onClick,
  buttonRef,
}: HamburgerButtonProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-blueprint-line bg-white p-2 text-ink transition-colors hover:border-blueprint-navy hover:text-blueprint-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-navy focus-visible:ring-offset-2"
      aria-label="Open navigation menu"
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
    >
      <span className="sr-only">Menu</span>
      <span className="flex w-5 flex-col gap-1.5" aria-hidden>
        <span className="h-0.5 w-full rounded bg-current" />
        <span className="h-0.5 w-full rounded bg-current" />
        <span className="h-0.5 w-full rounded bg-current" />
      </span>
    </button>
  );
}
