type HastNode = {
  children?: HastNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
  value?: string;
};

function getTextContent(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  if (!node.children) return "";
  return node.children.map(getTextContent).join("");
}

function elementChildren(node: HastNode, tagName: string): HastNode[] {
  return (node.children ?? []).filter(
    (c) => c.type === "element" && c.tagName === tagName,
  );
}

function firstElement(node: HastNode, tagName: string): HastNode | undefined {
  return (node.children ?? []).find(
    (c) => c.type === "element" && c.tagName === tagName,
  );
}

function tableToCards(table: HastNode): HastNode | null {
  const thead = firstElement(table, "thead");
  const tbody = firstElement(table, "tbody");
  if (!thead || !tbody) return null;

  const headerRow = firstElement(thead, "tr");
  if (!headerRow) return null;

  const headers = elementChildren(headerRow, "th").map((th) =>
    getTextContent(th).trim(),
  );
  if (headers.length === 0) return null;

  const rows = elementChildren(tbody, "tr");
  if (rows.length === 0) return null;

  const cards: HastNode[] = [];

  for (const row of rows) {
    const cells = elementChildren(row, "td");
    if (cells.length === 0) continue;

    const cardChildren: HastNode[] = [];

    cardChildren.push({
      type: "element",
      tagName: "div",
      properties: { className: ["doc-table-card-title"] },
      children: cells[0].children ?? [],
    });

    const dlChildren: HastNode[] = [];
    for (let i = 1; i < cells.length; i++) {
      const label = i < headers.length ? headers[i] : `Column ${i + 1}`;
      dlChildren.push({
        type: "element",
        tagName: "dt",
        properties: {},
        children: [{ type: "text", value: label }],
      });
      dlChildren.push({
        type: "element",
        tagName: "dd",
        properties: {},
        children: cells[i].children ?? [],
      });
    }

    if (dlChildren.length > 0) {
      cardChildren.push({
        type: "element",
        tagName: "dl",
        properties: { className: ["doc-table-card-fields"] },
        children: dlChildren,
      });
    }

    cards.push({
      type: "element",
      tagName: "div",
      properties: { className: ["doc-table-card"] },
      children: cardChildren,
    });
  }

  return {
    type: "element",
    tagName: "div",
    properties: { className: ["doc-table-cards"] },
    children: cards,
  };
}

function transformNode(node: HastNode): void {
  if (!node.children) return;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child.type === "element" && child.tagName === "table") {
      const replacement = tableToCards(child);
      if (replacement) {
        node.children[i] = replacement;
      }
    } else {
      transformNode(child);
    }
  }
}

export default function rehypeResponsiveTables() {
  return (tree: unknown) => {
    if (!tree || typeof tree !== "object") return;
    transformNode(tree as HastNode);
  };
}
