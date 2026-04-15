type HastNode = {
  children?: HastNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
  value?: string;
};

const INTERNAL_HOSTS = new Set(["civicblueprint.org", "www.civicblueprint.org"]);

function isExternalHref(href: unknown): boolean {
  if (typeof href !== "string") return false;
  try {
    const url = new URL(href);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !INTERNAL_HOSTS.has(url.hostname) &&
      !url.hostname.endsWith(".civicblueprint.org")
    );
  } catch {
    return false;
  }
}

function visitLinks(node: HastNode): void {
  if (
    node.type === "element" &&
    node.tagName === "a" &&
    isExternalHref(node.properties?.href)
  ) {
    node.properties = node.properties ?? {};
    node.properties.target = "_blank";
    node.properties.rel = "noopener noreferrer";

    const existing = node.properties.className;
    if (Array.isArray(existing)) {
      if (!existing.includes("external-link")) {
        existing.push("external-link");
      }
    } else {
      node.properties.className = ["external-link"];
    }
  }

  if (node.children) {
    for (const child of node.children) {
      visitLinks(child);
    }
  }
}

export default function rehypeExternalLinks() {
  return (tree: unknown) => {
    if (!tree || typeof tree !== "object") return;
    visitLinks(tree as HastNode);
  };
}
