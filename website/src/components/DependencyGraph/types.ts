export type GraphEdgeType = "operational" | "reform";

export type GraphFilter = "all" | GraphEdgeType | "loops";

export type GraphViewMode = "2d" | "3d";

export type GraphNode = {
  id: string;
  short: string;
  name: string;
  layer: 1 | 2 | 3 | 4;
  operationalOut: string[];
  reformRequires: string[];
  recursiveBinds: string[];
  x?: number;
  y?: number;
  z?: number;
};

export type GraphLink = {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  isLoopPath: boolean;
};

export type GraphLoop = {
  id: string;
  name: string;
  path: string[];
  description: string;
};
