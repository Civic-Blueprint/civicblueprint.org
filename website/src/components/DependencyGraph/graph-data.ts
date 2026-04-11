import type { GraphLink, GraphLoop, GraphNode } from "./types";

type GraphNodeDefinition = Omit<GraphNode, "x" | "y" | "z">;

const NODE_DEFINITIONS: GraphNodeDefinition[] = [
  {
    id: "1",
    name: "Energy and critical infrastructure",
    short: "Energy/Infrastructure",
    layer: 1,
    operationalOut: ["5", "6", "8"],
    reformRequires: ["4", "2", "15"],
    recursiveBinds: ["build_chain"],
  },
  {
    id: "2",
    name: "Money, credit, and capital allocation",
    short: "Capital Allocation",
    layer: 1,
    operationalOut: ["5", "6", "7", "9", "1"],
    reformRequires: ["13", "3", "15"],
    recursiveBinds: ["wealth_political_capture"],
  },
  {
    id: "3",
    name: "Information ecosystems",
    short: "Information Integrity",
    layer: 1,
    operationalOut: ["6", "7", "15", "13"],
    reformRequires: ["15", "13", "4"],
    recursiveBinds: ["information_democracy"],
  },
  {
    id: "4",
    name: "Institutional capacity",
    short: "Institutional Capacity",
    layer: 1,
    operationalOut: ["5", "6", "7", "8", "9", "13", "15"],
    reformRequires: ["14", "13", "15"],
    recursiveBinds: ["build_chain", "institutional_distrust"],
  },
  {
    id: "5",
    name: "Housing",
    short: "Housing",
    layer: 2,
    operationalOut: ["9"],
    reformRequires: ["1", "2", "4", "15"],
    recursiveBinds: ["housing_capacity_legitimacy"],
  },
  {
    id: "6",
    name: "Healthcare",
    short: "Healthcare",
    layer: 2,
    operationalOut: ["9"],
    reformRequires: ["2", "4", "3", "15"],
    recursiveBinds: ["care_capacity_talent"],
  },
  {
    id: "7",
    name: "Education and opportunity pathways",
    short: "Education",
    layer: 2,
    operationalOut: ["14", "4"],
    reformRequires: ["3", "2", "4", "15"],
    recursiveBinds: ["talent_capacity_loop"],
  },
  {
    id: "8",
    name: "Food systems",
    short: "Food",
    layer: 2,
    operationalOut: ["13"],
    reformRequires: ["1", "12", "4", "15"],
    recursiveBinds: ["ecology_food_stability"],
  },
  {
    id: "9",
    name: "Family support systems",
    short: "Family/Care",
    layer: 2,
    operationalOut: ["13", "14"],
    reformRequires: ["5", "6", "2", "15"],
    recursiveBinds: ["care_capacity_talent"],
  },
  {
    id: "10",
    name: "Wealth and power concentration",
    short: "Wealth Concentration",
    layer: 3,
    operationalOut: ["2", "5", "6", "15", "13", "4"],
    reformRequires: ["15", "13", "3"],
    recursiveBinds: ["wealth_political_capture"],
  },
  {
    id: "11",
    name: "AI and compute concentration",
    short: "AI Concentration",
    layer: 3,
    operationalOut: ["10", "3", "4", "7", "15"],
    reformRequires: ["15", "4", "13"],
    recursiveBinds: ["ai_concentration_ratchet"],
  },
  {
    id: "12",
    name: "Ecological systems stress",
    short: "Ecological Stability",
    layer: 3,
    operationalOut: ["1", "8", "6", "5"],
    reformRequires: ["15", "4", "13"],
    recursiveBinds: ["ecology_food_stability"],
  },
  {
    id: "13",
    name: "Institutional trust and legitimacy",
    short: "Institutional Legitimacy",
    layer: 4,
    operationalOut: ["4", "15", "2", "3"],
    reformRequires: ["4", "15"],
    recursiveBinds: ["institutional_distrust", "information_democracy"],
  },
  {
    id: "14",
    name: "Public-interest talent pipeline",
    short: "Talent Pipeline",
    layer: 4,
    operationalOut: ["4"],
    reformRequires: ["4", "13", "15"],
    recursiveBinds: ["talent_capacity_loop"],
  },
  {
    id: "15",
    name: "Democratic process",
    short: "Democratic Process",
    layer: 4,
    operationalOut: ["13", "4", "1", "2", "3", "5", "6", "7", "8", "9"],
    reformRequires: ["15", "13", "3"],
    recursiveBinds: ["democratic_process_reform", "information_democracy"],
  },
];

export const loops: GraphLoop[] = [
  {
    id: "institutional_distrust",
    name: "Institutional distrust cycle",
    path: ["13", "4", "13"],
    description:
      "Distrust reduces public investment; reduced investment degrades institutional performance; degraded performance deepens distrust.",
  },
  {
    id: "wealth_political_capture",
    name: "Wealth-political capture cycle",
    path: ["10", "15", "10"],
    description:
      "Concentration funds political influence; political influence preserves the rules that enable concentration; concentration increases.",
  },
  {
    id: "information_democracy",
    name: "Information-democracy cycle",
    path: ["3", "15", "3"],
    description:
      "Degraded information weakens democratic process; weakened democratic process cannot govern information platforms; information degrades further.",
  },
  {
    id: "democratic_process_reform",
    name: "Democratic process-reform cycle",
    path: ["15", "15"],
    description:
      "Fixing democratic process requires democratic process; degraded process blocks its own reform; degradation compounds.",
  },
  {
    id: "build_chain",
    name: "Build chain",
    path: ["4", "1", "5", "13", "4"],
    description:
      "Institutional capacity enables infrastructure; infrastructure enables housing; housing stability rebuilds legitimacy; legitimacy sustains institutional capacity.",
  },
  {
    id: "talent_capacity_loop",
    name: "Talent-capacity loop",
    path: ["14", "4", "13", "14"],
    description:
      "Talent feeds institutional capacity; capacity builds legitimacy; legitimacy attracts talent.",
  },
  {
    id: "housing_capacity_legitimacy",
    name: "Housing-capacity-legitimacy cascade",
    path: ["5", "9", "13", "4", "5"],
    description:
      "Housing reform stabilises families; family stability supports institutional legitimacy; legitimacy sustains capacity to reform housing.",
  },
  {
    id: "care_capacity_talent",
    name: "Care-talent trap",
    path: ["9", "14", "4", "6", "9"],
    description:
      "Weak care systems burn out public-interest talent; talent loss degrades institutional capacity; weakened capacity cannot reform healthcare; healthcare failure worsens care systems.",
  },
  {
    id: "ecology_food_stability",
    name: "Ecology-food-stability chain",
    path: ["12", "8", "13", "4", "12"],
    description:
      "Ecological stress degrades food systems; food insecurity erodes legitimacy; legitimacy loss weakens institutional capacity to pursue ecological reform.",
  },
  {
    id: "ai_concentration_ratchet",
    name: "AI concentration ratchet",
    path: ["11", "10", "15", "11"],
    description:
      "AI concentration accelerates wealth concentration; wealth concentration captures democratic process; captured process cannot govern AI deployment.",
  },
];

const layerX = {
  1: [-360, -120, 120, 360],
  2: [-420, -210, 0, 210, 420],
  3: [-280, 0, 280],
  4: [-260, 0, 260],
} as const;

const layerY = {
  1: 260,
  2: 80,
  3: -100,
  4: -280,
} as const;

const layerZ = {
  1: -180,
  2: -60,
  3: 60,
  4: 180,
} as const;

const layerCounters: Record<1 | 2 | 3 | 4, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
};

export const nodes: GraphNode[] = NODE_DEFINITIONS.map((node) => {
  const index = layerCounters[node.layer];
  layerCounters[node.layer] += 1;

  return {
    ...node,
    x: layerX[node.layer][index] ?? 0,
    y: layerY[node.layer],
    z: layerZ[node.layer],
  };
});

const loopLinkSet = new Set(
  loops.flatMap((loop) =>
    loop.path.slice(0, -1).map((source, index) => {
      const target = loop.path[index + 1];
      return `${source}:${target}`;
    }),
  ),
);

const operationalLinksRaw: Omit<GraphLink, "curvature">[] = nodes.flatMap(
  (node) =>
    node.operationalOut.map((target) => ({
      id: `operational:${node.id}->${target}`,
      source: node.id,
      target,
      type: "operational" as const,
      isLoopPath: loopLinkSet.has(`${node.id}:${target}`),
    })),
);

const reformLinksRaw: Omit<GraphLink, "curvature">[] = nodes.flatMap((node) =>
  node.reformRequires.map((requiredId) => ({
    id: `reform:${requiredId}->${node.id}`,
    source: requiredId,
    target: node.id,
    type: "reform" as const,
    isLoopPath: loopLinkSet.has(`${requiredId}:${node.id}`),
  })),
);

function assignCurvatures(
  rawLinks: Omit<GraphLink, "curvature">[],
): GraphLink[] {
  const pairKey = (a: string, b: string) => (a < b ? `${a}:${b}` : `${b}:${a}`);

  const pairGroups = new Map<string, Omit<GraphLink, "curvature">[]>();
  for (const link of rawLinks) {
    const key = pairKey(link.source, link.target);
    const group = pairGroups.get(key);
    if (group !== undefined) {
      group.push(link);
    } else {
      pairGroups.set(key, [link]);
    }
  }

  const result: GraphLink[] = [];
  for (const group of pairGroups.values()) {
    if (group.length === 1) {
      result.push({ ...group[0], curvature: group[0].isLoopPath ? 0.15 : 0 });
      continue;
    }

    const step = 0.22;
    const offset = -((group.length - 1) * step) / 2;
    for (let i = 0; i < group.length; i++) {
      result.push({ ...group[i], curvature: offset + i * step });
    }
  }

  return result;
}

export const links: GraphLink[] = assignCurvatures([
  ...operationalLinksRaw,
  ...reformLinksRaw,
]);

export const nodeById = new Map(nodes.map((node) => [node.id, node]));

export const loopById = new Map(loops.map((loop) => [loop.id, loop]));
