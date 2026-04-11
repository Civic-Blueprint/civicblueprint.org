"use client";

import { useEffect, useState } from "react";

type BackToTopProps = {
  threshold?: number;
};

export function BackToTop({ threshold = 400 }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  if (isVisible === false) {
    return null;
  }

  return (
    <button
      type="button"
      className="fixed bottom-5 right-5 z-30 inline-flex min-h-11 items-center rounded-md border border-blueprint-line bg-white px-4 py-2 text-sm font-semibold text-ink shadow-md transition-colors hover:border-blueprint-navy hover:text-blueprint-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-navy focus-visible:ring-offset-2"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      Back to top
    </button>
  );
}
