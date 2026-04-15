declare module "/pagefind/pagefind.js" {
  export type PagefindSearchData = {
    excerpt: string;
    meta: Record<string, string>;
    url: string;
  };

  export type PagefindSearchEntry = {
    data: () => Promise<PagefindSearchData>;
    id: string;
    score: number;
  };

  export type PagefindSearchResponse = {
    results: PagefindSearchEntry[];
  };

  export function search(
    term: string,
    options?: {
      filters?: Record<string, string | string[]>;
    },
  ): Promise<PagefindSearchResponse>;

  const pagefind: {
    search: typeof search;
  };

  export default pagefind;
}
