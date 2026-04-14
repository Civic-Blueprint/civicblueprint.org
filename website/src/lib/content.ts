import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type DocCategory =
  | "core"
  | "memos"
  | "proposals"
  | "exchanges"
  | "process"
  | "other";

export type DocSummary = {
  category: DocCategory;
  description: string;
  githubUrl: string;
  lastModified: Date;
  provenance?: string;
  route: string;
  slug: string[];
  sourcePath: string;
  title: string;
};

export type DocPage = DocSummary & {
  html: string;
  toc: TocEntry[];
};

export type TocEntry = {
  depth: number;
  id: string;
  text: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content", "project-2028");
const GITHUB_BASE_URL =
  "https://github.com/Civic-Blueprint/project-2028/blob/main";
const CORE_ORDER = [
  "readme",
  "principles",
  "problem-map",
  "systems-framework",
  "contributing",
];
const EXCHANGES_ORDER = ["exchanges/-exchange-index"];

let docsCache: Promise<DocPage[]> | null = null;

type HastNode = {
  children?: HastNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
  value?: string;
};

function toPosix(relativePath: string) {
  return relativePath.split(path.sep).join(path.posix.sep);
}

function toSegment(segment: string) {
  return segment.toLowerCase().replaceAll("_", "-");
}

function toSlug(relativePath: string) {
  const withoutExtension = relativePath.replace(/\.md$/i, "");
  const segments = withoutExtension
    .split(path.posix.sep)
    .filter(Boolean)
    .map(toSegment);

  if (
    (segments[0] === "agent" || segments[0] === "docs") &&
    segments.length > 1
  ) {
    return segments.slice(1);
  }

  return segments;
}

function toRoute(slug: string[]) {
  return `/docs/${slug.join("/")}`;
}

function toCategory(relativePath: string): DocCategory {
  if (relativePath.startsWith("memos/")) {
    return "memos";
  }

  if (relativePath.startsWith("proposals/")) {
    return "proposals";
  }

  if (relativePath.startsWith("agent/exchanges/")) {
    return "exchanges";
  }

  if (relativePath.startsWith("agent/process/")) {
    return "process";
  }

  if (
    relativePath.startsWith("agent/") ||
    relativePath.startsWith(".cursor/")
  ) {
    return "other";
  }

  return "core";
}

function fallbackTitle(relativePath: string) {
  const baseName = path.posix.basename(relativePath, ".md");
  const spaced = baseName.replaceAll("_", " ").replaceAll("-", " ");
  return spaced.replace(/\b\w/g, (match) => match.toUpperCase());
}

function extractTitle(
  content: string,
  frontmatterTitle: unknown,
  relativePath: string,
) {
  if (
    typeof frontmatterTitle === "string" &&
    frontmatterTitle.trim().length > 0
  ) {
    return frontmatterTitle.trim();
  }

  const firstHeading = content.match(/^#\s+(.+)$/m);
  if (firstHeading?.[1]) {
    return firstHeading[1].trim();
  }

  return fallbackTitle(relativePath);
}

function extractDescription(
  content: string,
  frontmatterDescription: unknown,
  fallback = "Project document",
) {
  if (
    typeof frontmatterDescription === "string" &&
    frontmatterDescription.trim().length > 0
  ) {
    return frontmatterDescription.trim();
  }

  const paragraphLines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !line.startsWith("#") &&
        !line.startsWith(">") &&
        !/^-{3,}$/.test(line) &&
        !/^\*{3,}$/.test(line) &&
        !/^_{3,}$/.test(line),
    );

  return paragraphLines[0] ?? fallback;
}

function extractOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function stripProvenanceCallout(html: string) {
  return html.replace(
    /\s*<blockquote>\s*<p>\s*<strong>Provenance:<\/strong>[\s\S]*?<a href="\/docs\/content-provenance">[\s\S]*?<\/a>\.?[\s\S]*?<\/p>\s*<\/blockquote>/,
    "",
  );
}

function shouldRewriteLink(href: string) {
  if (
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }

  return (
    href.toLowerCase().endsWith(".md") || href.toLowerCase().includes(".md#")
  );
}

function rewriteMarkdownLinks(
  markdown: string,
  currentRelativePath: string,
  routeByRelativePath: Map<string, string>,
) {
  return markdown.replace(
    /\[([^\]]+)\]\(([^)\s]+)(\s+"[^"]*")?\)/g,
    (full, label, hrefRaw: string, titlePart = "") => {
      const href = hrefRaw.replace(/^<|>$/g, "");
      if (!shouldRewriteLink(href)) {
        return full;
      }

      const [targetPath, targetHash] = href.split("#");
      const normalizedTarget = path.posix.normalize(
        path.posix.join(path.posix.dirname(currentRelativePath), targetPath),
      );
      const route = routeByRelativePath.get(normalizedTarget);
      if (!route) {
        return full;
      }

      const rewrittenHref = targetHash ? `${route}#${targetHash}` : route;
      return `[${label}](${rewrittenHref}${titlePart ?? ""})`;
    },
  );
}

async function getMarkdownFiles(
  directoryPath: string,
  baseDirectoryPath: string,
): Promise<string[]> {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getMarkdownFiles(absolutePath, baseDirectoryPath)));
      continue;
    }

    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".md")) {
      continue;
    }

    const relativePath = toPosix(
      path.relative(baseDirectoryPath, absolutePath),
    );
    if (relativePath.startsWith(".cursor/")) {
      continue;
    }

    files.push(relativePath);
  }

  return files;
}

function sortDocs(docs: DocPage[]) {
  return docs.sort((a, b) => {
    if (a.category !== b.category) {
      const order: DocCategory[] = [
        "core",
        "memos",
        "proposals",
        "process",
        "exchanges",
        "other",
      ];
      return order.indexOf(a.category) - order.indexOf(b.category);
    }

    if (a.category === "core" && b.category === "core") {
      const aIndex = CORE_ORDER.indexOf(a.slug.join("/"));
      const bIndex = CORE_ORDER.indexOf(b.slug.join("/"));
      if (aIndex !== -1 || bIndex !== -1) {
        return (
          (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
          (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
        );
      }
    }

    if (a.category === "exchanges" && b.category === "exchanges") {
      const aIndex = EXCHANGES_ORDER.indexOf(a.slug.join("/"));
      const bIndex = EXCHANGES_ORDER.indexOf(b.slug.join("/"));
      if (aIndex !== -1 || bIndex !== -1) {
        return (
          (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
          (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
        );
      }
    }

    return a.title.localeCompare(b.title);
  });
}

function getHeadingText(node: HastNode): string {
  if (node.type === "text" && typeof node.value === "string") {
    return node.value;
  }

  if (!node.children || node.children.length === 0) {
    return "";
  }

  return node.children.map((child) => getHeadingText(child)).join("");
}

function collectTocEntries(node: HastNode, toc: TocEntry[]) {
  if (node.type === "element" && node.tagName) {
    const match = /^h([1-4])$/.exec(node.tagName);
    if (match) {
      const id = node.properties?.id;
      if (typeof id === "string" && id.length > 0) {
        const text = getHeadingText(node).trim();
        if (text.length > 0) {
          toc.push({
            depth: Number(match[1]),
            id,
            text,
          });
        }
      }
    }
  }

  if (!node.children || node.children.length === 0) {
    return;
  }

  for (const child of node.children) {
    collectTocEntries(child, toc);
  }
}

function rehypeCollectToc(toc: TocEntry[]) {
  return () => (tree: unknown) => {
    if (!tree || typeof tree !== "object") {
      return;
    }

    collectTocEntries(tree as HastNode, toc);
  };
}

async function buildDocs(): Promise<DocPage[]> {
  const markdownFiles = await getMarkdownFiles(CONTENT_ROOT, CONTENT_ROOT);
  const routeByRelativePath = new Map<string, string>();

  for (const relativePath of markdownFiles) {
    routeByRelativePath.set(relativePath, toRoute(toSlug(relativePath)));
  }

  const docs = await Promise.all(
    markdownFiles.map(async (relativePath): Promise<DocPage> => {
      const absolutePath = path.join(CONTENT_ROOT, relativePath);
      const rawMarkdown = await fs.readFile(absolutePath, "utf8");
      const stat = await fs.stat(absolutePath);
      const parsed = matter(rawMarkdown);
      const toc: TocEntry[] = [];
      const markdown = rewriteMarkdownLinks(
        parsed.content,
        relativePath,
        routeByRelativePath,
      );

      const compiled = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeSlug)
        .use(rehypeCollectToc(toc))
        .use(rehypeAutolinkHeadings, {
          behavior: "append",
          properties: { className: ["doc-heading-link"] },
        })
        .use(rehypeStringify)
        .process(markdown);
      const provenance = extractOptionalString(parsed.data.provenance);
      const rawHtml = String(compiled);
      const html = provenance ? stripProvenanceCallout(rawHtml) : rawHtml;

      const slug = toSlug(relativePath);
      return {
        category: toCategory(relativePath),
        description: extractDescription(
          parsed.content,
          parsed.data.description,
        ),
        githubUrl: `${GITHUB_BASE_URL}/${relativePath}`,
        html,
        lastModified: stat.mtime,
        provenance,
        route: toRoute(slug),
        slug,
        sourcePath: relativePath,
        toc,
        title: extractTitle(parsed.content, parsed.data.title, relativePath),
      };
    }),
  );

  return sortDocs(docs);
}

async function getDocsInternal() {
  if (!docsCache) {
    docsCache = buildDocs();
  }

  return docsCache;
}

export async function getAllDocs() {
  return getDocsInternal();
}

export async function getDocBySlug(slug: string[]) {
  const docs = await getDocsInternal();
  const joinedSlug = slug.join("/");
  return docs.find((doc) => doc.slug.join("/") === joinedSlug) ?? null;
}

export async function getDocsNavigation() {
  const docs = await getDocsInternal();

  return {
    core: docs.filter((doc) => doc.category === "core"),
    memos: docs.filter((doc) => doc.category === "memos"),
    proposals: docs.filter((doc) => doc.category === "proposals"),
    exchanges: docs.filter((doc) => doc.category === "exchanges"),
    other: docs.filter((doc) => doc.category === "other"),
    process: docs.filter((doc) => doc.category === "process"),
  };
}
