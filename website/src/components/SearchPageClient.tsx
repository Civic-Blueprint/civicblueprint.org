"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type DocCategory =
  | "core"
  | "formation-docs"
  | "memos"
  | "proposals"
  | "sources"
  | "process"
  | "exchanges";

type SearchCategory = "all" | DocCategory;

type CategoryOption = {
  label: string;
  value: SearchCategory;
};

type PagefindSearchData = {
  excerpt: string;
  meta: Record<string, string>;
  url: string;
};

type PagefindSearchEntry = {
  data: () => Promise<PagefindSearchData>;
  id: string;
  score: number;
};

type PagefindSearchResponse = {
  results: PagefindSearchEntry[];
};

type PagefindModule = {
  search: (
    term: string,
    options?: {
      filters?: Record<string, string | string[]>;
    },
  ) => Promise<PagefindSearchResponse>;
};

type SearchResult = {
  category: SearchCategory;
  excerpt: string;
  sourcePath: string;
  title: string;
  url: string;
};

const categoryOptions: CategoryOption[] = [
  { label: "All", value: "all" },
  { label: "Core", value: "core" },
  { label: "Formation Docs", value: "formation-docs" },
  { label: "Memos", value: "memos" },
  { label: "Proposals", value: "proposals" },
  { label: "Source Digests", value: "sources" },
  { label: "Process", value: "process" },
  { label: "Exchanges", value: "exchanges" },
];

function isSearchCategory(value: string): value is SearchCategory {
  return categoryOptions.some((option) => option.value === value);
}

function normalizeResultUrl(url: string) {
  let normalized = url;
  normalized = normalized.replace(/\/index\.html$/, "/");
  normalized = normalized.replace(/\.html$/, "");
  return normalized.length > 0 ? normalized : "/";
}

function categoryLabel(value: SearchCategory) {
  const match = categoryOptions.find((option) => option.value === value);
  return match?.label ?? "All";
}

export function SearchPageClient() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [indexReady, setIndexReady] = useState(false);
  const [hasHydratedParams, setHasHydratedParams] = useState(false);
  const moduleRef = useRef<PagefindModule | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");
    const initialCategoryParam = params.get("c");

    setQuery(initialQuery ?? "");
    if (
      initialCategoryParam !== null &&
      isSearchCategory(initialCategoryParam) === true
    ) {
      setCategory(initialCategoryParam);
    } else {
      setCategory("all");
    }
    setHasHydratedParams(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPagefind() {
      try {
        // Pagefind emits this module after build; it does not exist in `next dev`.
        const pagefindModulePath = "/pagefind/pagefind.js";
        const loaded = await import(
          /* webpackIgnore: true */ pagefindModulePath
        );
        const pagefind =
          (loaded as { default?: PagefindModule }).default ??
          (loaded as PagefindModule);
        if (isMounted === true) {
          moduleRef.current = pagefind;
          setIndexReady(true);
        }
      } catch {
        if (isMounted === true) {
          setLoadError(
            "Search index is not available yet. Build the site to generate Pagefind assets.",
          );
        }
      }
    }

    void loadPagefind();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (hasHydratedParams === false) {
      return;
    }

    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery.length > 0) {
      params.set("q", trimmedQuery);
    }

    if (category !== "all") {
      params.set("c", category);
    }

    const suffix = params.toString();
    const nextUrl = suffix.length > 0 ? `${pathname}?${suffix}` : pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [category, hasHydratedParams, pathname, query]);

  useEffect(() => {
    let isMounted = true;
    const trimmedQuery = query.trim();

    async function runSearch() {
      if (moduleRef.current === null || indexReady === false) {
        return;
      }

      if (trimmedQuery.length === 0) {
        if (isMounted === true) {
          setResults([]);
          setIsLoading(false);
          setLoadError(null);
        }
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const filters =
          category === "all" ? undefined : { category: category as DocCategory };
        const response = await moduleRef.current.search(trimmedQuery, {
          filters,
        });

        const resolvedResults = await Promise.all(
          response.results.map(async (entry) => {
            const data = await entry.data();
            const metadataTitle = data.meta.title;
            const metadataSourcePath = data.meta.sourcePath;
            const metadataCategory = data.meta.category;
            const parsedCategory =
              typeof metadataCategory === "string" && isSearchCategory(metadataCategory)
                ? metadataCategory
                : "all";

            return {
              category: parsedCategory,
              excerpt: data.excerpt,
              sourcePath:
                typeof metadataSourcePath === "string"
                  ? metadataSourcePath
                  : "Project document",
              title:
                typeof metadataTitle === "string"
                  ? metadataTitle
                  : "Untitled document",
              url: normalizeResultUrl(data.url),
            } satisfies SearchResult;
          }),
        );

        if (isMounted === true) {
          setResults(resolvedResults);
          setIsLoading(false);
        }
      } catch {
        if (isMounted === true) {
          setLoadError("Search failed. Please try a different query.");
          setResults([]);
          setIsLoading(false);
        }
      }
    }

    const timeoutId = window.setTimeout(() => {
      void runSearch();
    }, 160);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [category, hasHydratedParams, indexReady, query]);

  const statusText = useMemo(() => {
    if (loadError !== null) {
      return loadError;
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      return "Search across core docs, formation analysis, memos, proposals, source digests, process notes, and exchanges.";
    }

    if (isLoading === true) {
      return `Searching for "${trimmedQuery}"...`;
    }

    if (results.length === 0) {
      return `No results for "${trimmedQuery}".`;
    }

    return `${results.length} result${results.length === 1 ? "" : "s"} for "${trimmedQuery}".`;
  }, [isLoading, loadError, query, results.length]);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="section-eyebrow">Search</p>
        <h1 className="section-title text-ink">Search Project Documents</h1>
        <p className="section-lead">
          Find references quickly across the public Civic Blueprint corpus without
          leaving the site.
        </p>
      </header>

      <div className="blueprint-card space-y-4 p-4 md:p-5">
        <label
          htmlFor="search-documents-input"
          className="text-sm font-semibold text-slate"
        >
          Search docs
        </label>
        <input
          id="search-documents-input"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          autoFocus
          placeholder="Try accountability, dignity, participation..."
          className="w-full rounded-md border border-blueprint-line bg-white px-3 py-2.5 text-sm text-ink shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-navy focus-visible:ring-offset-2"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categoryOptions.map((option) => {
            const isActive = option.value === category;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setCategory(option.value);
                }}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                  isActive
                    ? "border-blueprint-navy bg-blueprint-navy text-white"
                    : "border-blueprint-line bg-white text-slate hover:border-blueprint-navy hover:text-blueprint-navy"
                }`}
                aria-pressed={isActive}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-muted">{statusText}</p>

      {results.length > 0 ? (
        <ol className="space-y-3">
          {results.map((result) => (
            <li key={`${result.url}-${result.sourcePath}`} className="blueprint-card p-4 md:p-5">
              <p className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                <span>{categoryLabel(result.category)}</span>
                <span aria-hidden="true">•</span>
                <span className="normal-case tracking-normal">{result.sourcePath}</span>
              </p>
              <h2 className="mb-2 text-lg font-semibold text-ink">
                <Link href={result.url} className="text-link">
                  {result.title}
                </Link>
              </h2>
              <p
                className="text-sm leading-relaxed text-slate"
                dangerouslySetInnerHTML={{ __html: result.excerpt }}
              />
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
