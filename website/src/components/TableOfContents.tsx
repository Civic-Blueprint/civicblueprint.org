"use client";

import { useEffect, useMemo, useState } from "react";

import type { TocEntry } from "@/lib/content";

type TableOfContentsProps = {
  entries: TocEntry[];
  title?: string;
  collapsible?: boolean;
  className?: string;
};

function getIndentClass(depth: number) {
  if (depth === 1) {
    return "";
  }

  if (depth === 2) {
    return "pl-2";
  }

  if (depth === 3) {
    return "pl-4";
  }

  return "pl-6";
}

function TocList({
  activeId,
  entries,
}: {
  activeId: string | null;
  entries: TocEntry[];
}) {
  return (
    <ol className="space-y-2 text-sm">
      {entries.map((entry) => {
        const isActive = activeId === entry.id;
        const itemClassName = isActive
          ? "block rounded px-2 py-1 font-semibold text-blueprint-navy"
          : "block rounded px-2 py-1 text-slate hover:text-blueprint-navy";

        return (
          <li key={entry.id} className={getIndentClass(entry.depth)}>
            <a href={`#${entry.id}`} className={itemClassName}>
              {entry.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function TableOfContents({
  entries,
  title = "On this page",
  collapsible = false,
  className = "",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const minEntriesToRender = 3;
  const headingIds = useMemo(() => entries.map((entry) => entry.id), [entries]);

  useEffect(() => {
    if (entries.length === 0) {
      setActiveId(null);
      return;
    }

    setActiveId(entries[0].id);
  }, [entries]);

  useEffect(() => {
    if (entries.length === 0) {
      return;
    }

    const idOrder = new Map(entries.map((entry, index) => [entry.id, index]));
    const visibleHeadings = new Set<string>();
    const observedElements = headingIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (observedElements.length === 0) {
      return;
    }

    const resolveActiveId = () => {
      if (visibleHeadings.size > 0) {
        const sortedVisible = Array.from(visibleHeadings).sort((a, b) => {
          const aOrder = idOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
          const bOrder = idOrder.get(b) ?? Number.MAX_SAFE_INTEGER;
          return aOrder - bOrder;
        });
        const firstVisible = sortedVisible[0];
        setActiveId(firstVisible ?? null);
        return;
      }

      const viewportOffset = 120;
      let fallbackId: string | null = entries[0].id ?? null;
      for (const entry of entries) {
        const element = document.getElementById(entry.id);
        if (element === null) {
          continue;
        }

        if (element.getBoundingClientRect().top <= viewportOffset) {
          fallbackId = entry.id;
        }
      }

      setActiveId(fallbackId);
    };

    const observer = new IntersectionObserver(
      (intersectionEntries) => {
        for (const intersectionEntry of intersectionEntries) {
          const targetId = intersectionEntry.target.id;
          if (intersectionEntry.isIntersecting === true) {
            visibleHeadings.add(targetId);
          } else {
            visibleHeadings.delete(targetId);
          }
        }

        resolveActiveId();
      },
      {
        root: null,
        rootMargin: "-96px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    for (const element of observedElements) {
      observer.observe(element);
    }

    resolveActiveId();

    return () => {
      observer.disconnect();
    };
  }, [entries, headingIds]);

  if (entries.length < minEntriesToRender) {
    return null;
  }

  if (collapsible === true) {
    return (
      <details
        className={`toc-mobile rounded-lg border border-blueprint-line ${className}`}
      >
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold uppercase tracking-widest text-muted">
          {title}
        </summary>
        <div className="border-t border-blueprint-line px-2 py-3">
          <TocList entries={entries} activeId={activeId} />
        </div>
      </details>
    );
  }

  return (
    <nav
      aria-label={title}
      className={`toc-rail blueprint-card max-h-[calc(100dvh-8rem)] overflow-y-auto p-4 ${className}`}
    >
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        {title}
      </h2>
      <TocList entries={entries} activeId={activeId} />
    </nav>
  );
}
