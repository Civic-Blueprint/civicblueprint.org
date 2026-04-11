"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import ForceGraph3D from "react-force-graph-3d";

import { links, loopById, nodeById, nodes } from "./graph-data";
import type {
  GraphFilter,
  GraphLink,
  GraphLoop,
  GraphNode,
  GraphViewMode,
} from "./types";

type ForceNode = GraphNode & {
  vx?: number;
  vy?: number;
  vz?: number;
};

type ForceLink = Omit<GraphLink, "source" | "target"> & {
  source: string | ForceNode;
  target: string | ForceNode;
};

const FILTERS: Array<{ id: GraphFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "operational", label: "Operational" },
  { id: "reform", label: "Reform" },
  { id: "loops", label: "Loops" },
];

function toNodeId(endpoint: ForceLink["source"]): string {
  if (typeof endpoint === "string") {
    return endpoint;
  }

  return endpoint.id;
}

function cloneGraphData(): { nodes: ForceNode[]; links: ForceLink[] } {
  return {
    nodes: nodes.map((node) => ({ ...node })),
    links: links.map((link) => ({
      ...link,
      source: link.source,
      target: link.target,
    })),
  };
}

export function DependencyGraph() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ref2d = useRef<any>(undefined);
  const ref3d = useRef<any>(undefined);
  const graphViewportRef = useRef<HTMLDivElement | null>(null);

  const [viewMode, setViewMode] = useState<GraphViewMode>("2d");
  const [filter, setFilter] = useState<GraphFilter>("all");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [graphWidth, setGraphWidth] = useState<number>(640);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activeNodeId = selectedNodeId ?? hoveredNodeId;

  const graphData = useMemo(() => cloneGraphData(), []);

  const visibleLinks = useMemo(() => {
    return graphData.links.filter((link) => {
      if (filter === "all") {
        return true;
      }

      if (filter === "loops") {
        return link.isLoopPath;
      }

      return link.type === filter;
    });
  }, [filter, graphData.links]);

  const visibleLinkIds = useMemo(() => {
    return new Set(visibleLinks.map((link) => link.id));
  }, [visibleLinks]);

  const visibleNodeIds = useMemo(() => {
    const ids = new Set<string>();

    visibleLinks.forEach((link) => {
      ids.add(toNodeId(link.source));
      ids.add(toNodeId(link.target));
    });

    if (activeNodeId !== null) {
      ids.add(activeNodeId);
    }

    return ids;
  }, [activeNodeId, visibleLinks]);

  const connectedLinkIds = useMemo(() => {
    const ids = new Set<string>();

    if (activeNodeId === null) {
      return ids;
    }

    visibleLinks.forEach((link) => {
      const sourceId = toNodeId(link.source);
      const targetId = toNodeId(link.target);
      if (sourceId === activeNodeId || targetId === activeNodeId) {
        ids.add(link.id);
      }
    });

    return ids;
  }, [activeNodeId, visibleLinks]);

  const connectedNodeIds = useMemo(() => {
    const ids = new Set<string>();

    if (activeNodeId === null) {
      return ids;
    }

    ids.add(activeNodeId);
    visibleLinks.forEach((link) => {
      if (connectedLinkIds.has(link.id) === false) {
        return;
      }
      ids.add(toNodeId(link.source));
      ids.add(toNodeId(link.target));
    });

    return ids;
  }, [activeNodeId, connectedLinkIds, visibleLinks]);

  const activeConnectedNodes = useMemo(() => {
    if (activeNodeId === null) {
      return [];
    }

    return Array.from(connectedNodeIds)
      .filter((id) => id !== activeNodeId)
      .map((id) => nodeById.get(id))
      .filter((node): node is GraphNode => node !== undefined);
  }, [activeNodeId, connectedNodeIds]);

  const selectedNode =
    selectedNodeId !== null ? (nodeById.get(selectedNodeId) ?? null) : null;

  const selectedNodeOperationalFeeds = useMemo(() => {
    if (selectedNode === null) {
      return [];
    }
    return selectedNode.operationalOut
      .map((id) => nodeById.get(id))
      .filter((node): node is GraphNode => node !== undefined);
  }, [selectedNode]);

  const selectedNodeReformRequires = useMemo(() => {
    if (selectedNode === null) {
      return [];
    }
    return selectedNode.reformRequires
      .map((id) => nodeById.get(id))
      .filter((node): node is GraphNode => node !== undefined);
  }, [selectedNode]);

  const selectedNodeRequiredFor = useMemo(() => {
    if (selectedNode === null) {
      return [];
    }

    return nodes.filter((node) =>
      node.reformRequires.includes(selectedNode.id),
    );
  }, [selectedNode]);

  const selectedNodeLoops = useMemo(() => {
    if (selectedNode === null) {
      return [];
    }

    return selectedNode.recursiveBinds
      .map((loopId) => loopById.get(loopId))
      .filter((loop): loop is GraphLoop => loop !== undefined);
  }, [selectedNode]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedNodeId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      const section = sectionRef.current;
      if (section === null) {
        setIsFullscreen(false);
        return;
      }

      setIsFullscreen(document.fullscreenElement === section);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const element = graphViewportRef.current;
    if (element === null) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry === undefined) {
        return;
      }

      const nextWidth = Math.max(Math.floor(entry.contentRect.width), 520);
      setGraphWidth(nextWidth);
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleResetView = () => {
    if (viewMode === "2d") {
      ref2d.current?.centerAt?.(0, 0, 500);
      ref2d.current?.zoomToFit?.(500, 90);
      return;
    }

    ref3d.current?.zoomToFit?.(500, 140);
    ref3d.current?.cameraPosition?.(
      { x: 0, y: 0, z: 800 },
      { x: 0, y: -20, z: 0 },
      500,
    );
  };

  const setCameraTopDown = () => {
    ref3d.current?.cameraPosition?.(
      { x: 0, y: 760, z: 0 },
      { x: 0, y: 0, z: 0 },
      500,
    );
  };

  const setCameraSide = () => {
    ref3d.current?.cameraPosition?.(
      { x: 0, y: 0, z: 900 },
      { x: 0, y: 0, z: 0 },
      500,
    );
  };

  const toggleFullscreen = async () => {
    const section = sectionRef.current;
    if (section === null) {
      return;
    }

    if (document.fullscreenElement === section) {
      await document.exitFullscreen();
      return;
    }

    await section.requestFullscreen();
  };

  const graphHeight = isFullscreen ? 760 : 520;
  const sectionClassName = isFullscreen
    ? "not-prose my-0 h-full w-full overflow-auto rounded-none bg-white p-4 md:p-6"
    : "not-prose my-8 w-full max-w-full overflow-hidden rounded-xl border border-blueprint-line bg-white p-4 md:p-5";

  const getNodeFill = (node: GraphNode) => {
    if (visibleNodeIds.has(node.id) === false) {
      return "rgba(17,24,39,0.1)";
    }

    if (activeNodeId === null) {
      return "#FFFFFF";
    }

    if (connectedNodeIds.has(node.id)) {
      return "#FFFFFF";
    }

    return "rgba(255,255,255,0.3)";
  };

  const getNodeStroke = (node: GraphNode) => {
    if (activeNodeId !== null && connectedNodeIds.has(node.id) === false) {
      return "rgba(18,62,124,0.2)";
    }

    if (node.id === activeNodeId) {
      return "#8B5C2A";
    }

    return "#123E7C";
  };

  const getLinkColor = (link: ForceLink) => {
    if (visibleLinkIds.has(link.id) === false) {
      return "rgba(17,24,39,0.05)";
    }

    const base =
      link.type === "operational"
        ? "rgba(18,62,124,0.78)"
        : "rgba(43,90,150,0.78)";

    if (activeNodeId === null) {
      return base;
    }

    if (connectedLinkIds.has(link.id)) {
      return base;
    }

    return "rgba(51,65,85,0.12)";
  };

  const getLinkWidth = (link: ForceLink) => {
    if (visibleLinkIds.has(link.id) === false) {
      return 0;
    }

    if (activeNodeId === null) {
      return link.isLoopPath ? 1.8 : 1.3;
    }

    return connectedLinkIds.has(link.id) ? 2.6 : 0.8;
  };

  const onNodeClick = (node: ForceNode) => {
    if (selectedNodeId === node.id) {
      setSelectedNodeId(null);
      return;
    }

    setSelectedNodeId(node.id);
  };

  const getNodeTooltip = (node: ForceNode) => {
    const base = `${node.name} (Layer ${node.layer})`;

    if (activeNodeId !== node.id) {
      return base;
    }

    if (activeConnectedNodes.length === 0) {
      return base;
    }

    return `${base}\nConnected: ${activeConnectedNodes.map((n) => n.short).join(", ")}`;
  };

  return (
    <section ref={sectionRef} className={sectionClassName}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="m-0 text-base font-semibold text-ink">
          Interactive Dependency Explorer
        </h3>
        <div className="hidden items-center gap-2 text-xs text-muted lg:flex">
          <span>Hover to inspect</span>
          <span aria-hidden="true">|</span>
          <span>Click to lock</span>
          <span aria-hidden="true">|</span>
          <span>Esc to clear</span>
        </div>
      </div>

      <div className="mb-3 hidden flex-wrap gap-2 lg:flex">
        <div className="flex rounded-md border border-blueprint-line bg-blueprint-surface p-1">
          <button
            type="button"
            className={`rounded px-2 py-1 text-xs font-semibold ${
              viewMode === "2d" ? "bg-white text-blueprint-navy" : "text-slate"
            }`}
            onClick={() => {
              setViewMode("2d");
            }}
          >
            2D
          </button>
          <button
            type="button"
            className={`rounded px-2 py-1 text-xs font-semibold ${
              viewMode === "3d" ? "bg-white text-blueprint-navy" : "text-slate"
            }`}
            onClick={() => {
              setViewMode("3d");
            }}
          >
            3D
          </button>
        </div>

        <div className="flex flex-wrap gap-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                filter === item.id
                  ? "border-blueprint-navy bg-blueprint-navy text-white"
                  : "border-blueprint-line bg-white text-slate"
              }`}
              onClick={() => {
                setFilter(item.id);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="rounded-md border border-blueprint-line bg-white px-2 py-1 text-xs font-semibold text-slate"
          onClick={handleResetView}
        >
          Reset view
        </button>
        <button
          type="button"
          className="rounded-md border border-blueprint-line bg-white px-2 py-1 text-xs font-semibold text-slate"
          onClick={() => {
            void toggleFullscreen();
          }}
        >
          {isFullscreen ? "Exit full screen" : "Full screen"}
        </button>

        {viewMode === "3d" ? (
          <>
            <button
              type="button"
              className="rounded-md border border-blueprint-line bg-white px-2 py-1 text-xs font-semibold text-slate"
              onClick={setCameraTopDown}
            >
              Top-down
            </button>
            <button
              type="button"
              className="rounded-md border border-blueprint-line bg-white px-2 py-1 text-xs font-semibold text-slate"
              onClick={setCameraSide}
            >
              Side
            </button>
          </>
        ) : null}
      </div>

      <div className="lg:hidden">
        <div className="overflow-hidden rounded-lg border border-blueprint-line bg-blueprint-surface">
          <img
            src="/images/dependency-map.svg"
            alt="Dependency map blueprint diagram"
            className="h-auto w-full"
          />
        </div>
        <p className="mt-2 text-sm text-muted">
          Explore this network interactively on a larger screen.
        </p>
      </div>

      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start lg:gap-3 xl:grid-cols-[minmax(0,1fr)_16rem]">
        <div
          ref={graphViewportRef}
          className="rounded-lg border border-blueprint-line bg-blueprint-surface p-2"
        >
          {viewMode === "2d" ? (
            <ForceGraph2D
              ref={ref2d}
              width={graphWidth}
              height={graphHeight}
              graphData={graphData}
              backgroundColor="#F7F4EF"
              cooldownTicks={0}
              enableNodeDrag={false}
              nodeLabel={(node: ForceNode) => getNodeTooltip(node)}
              nodeColor={(node: ForceNode) => getNodeFill(node)}
              nodeRelSize={6}
              nodeCanvasObject={(nodeRaw, ctx) => {
                const node = nodeRaw as ForceNode;
                const x = node.x ?? 0;
                const y = node.y ?? 0;
                const radius = node.id === activeNodeId ? 11 : 8;

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = getNodeFill(node);
                ctx.fill();
                ctx.lineWidth = node.id === activeNodeId ? 2.6 : 1.6;
                ctx.strokeStyle = getNodeStroke(node);
                ctx.stroke();

                ctx.font = "700 9px Public Sans, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#111827";
                ctx.fillText(node.id, x, y);

                if (node.id === activeNodeId) {
                  ctx.font = "600 11px Public Sans, sans-serif";
                  ctx.textAlign = "left";
                  ctx.textBaseline = "alphabetic";
                  ctx.fillStyle = "#111827";
                  ctx.fillText(node.short, x + 14, y - 10);
                } else if (
                  activeNodeId !== null &&
                  connectedNodeIds.has(node.id)
                ) {
                  ctx.font = "600 10px Public Sans, sans-serif";
                  ctx.textAlign = "left";
                  ctx.textBaseline = "alphabetic";
                  ctx.fillStyle = "#334155";
                  ctx.fillText(node.short, x + 10, y - 8);
                }
              }}
              linkColor={(link) => getLinkColor(link as ForceLink)}
              linkWidth={(link) => getLinkWidth(link as ForceLink)}
              linkDirectionalArrowLength={3}
              linkDirectionalArrowRelPos={1}
              onNodeHover={(node) => {
                setHoveredNodeId(node !== null ? (node as ForceNode).id : null);
              }}
              onNodeClick={(node) => {
                onNodeClick(node as ForceNode);
              }}
              onBackgroundClick={() => {
                setSelectedNodeId(null);
              }}
            />
          ) : (
            <ForceGraph3D
              ref={ref3d}
              width={graphWidth}
              height={graphHeight}
              graphData={graphData}
              backgroundColor="#F7F4EF"
              cooldownTicks={0}
              enableNodeDrag={false}
              nodeLabel={(node: ForceNode) => getNodeTooltip(node)}
              nodeColor={(node: ForceNode) => getNodeFill(node)}
              nodeOpacity={0.95}
              nodeResolution={14}
              linkColor={(link) => getLinkColor(link as ForceLink)}
              linkWidth={(link) => getLinkWidth(link as ForceLink)}
              linkDirectionalArrowLength={2.4}
              linkDirectionalArrowRelPos={1}
              linkCurvature={(link) =>
                (link as ForceLink).isLoopPath ? 0.12 : 0
              }
              onNodeHover={(node) => {
                setHoveredNodeId(node !== null ? (node as ForceNode).id : null);
              }}
              onNodeClick={(node) => {
                const typedNode = node as ForceNode;
                onNodeClick(typedNode);
                ref3d.current?.cameraPosition?.(
                  {
                    x: (typedNode.x ?? 0) + 140,
                    y: (typedNode.y ?? 0) + 110,
                    z: (typedNode.z ?? 0) + 220,
                  },
                  typedNode,
                  600,
                );
              }}
              onBackgroundClick={() => {
                setSelectedNodeId(null);
              }}
            />
          )}
        </div>

        <aside className="self-start rounded-lg border border-blueprint-line bg-blueprint-surface p-3">
          {selectedNode !== null ? (
            <>
              <h4 className="mb-1 text-sm font-semibold text-ink">
                {selectedNode.name}
              </h4>
              <p className="mb-3 text-xs text-muted">
                §{selectedNode.id} · Layer {selectedNode.layer}
              </p>

              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                Operationally feeds
              </p>
              <ul className="mb-3 space-y-1 text-sm text-slate">
                {selectedNodeOperationalFeeds.map((node) => (
                  <li key={node.id}>
                    §{node.id} {node.short}
                  </li>
                ))}
              </ul>

              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                Reform requires
              </p>
              <ul className="mb-3 space-y-1 text-sm text-slate">
                {selectedNodeReformRequires.map((node) => (
                  <li key={node.id}>
                    §{node.id} {node.short}
                  </li>
                ))}
              </ul>

              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                Required for reform by
              </p>
              <ul className="mb-3 space-y-1 text-sm text-slate">
                {selectedNodeRequiredFor.map((node) => (
                  <li key={node.id}>
                    §{node.id} {node.short}
                  </li>
                ))}
              </ul>

              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                Recursive loops
              </p>
              <ul className="space-y-2 text-xs text-slate">
                {selectedNodeLoops.map((loop) => (
                  <li key={loop.id}>
                    <p className="font-semibold text-ink">{loop.name}</p>
                    <p>{loop.description}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h4 className="mb-2 text-sm font-semibold text-ink">Inspector</h4>
              <p className="text-sm text-muted">
                Hover a node to preview its neighborhood. Click a node to lock
                selection and inspect its operational, reform, and recursive
                relationships.
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
