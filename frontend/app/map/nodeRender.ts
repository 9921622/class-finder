import type { LocationNode } from "~/types/LocationNode";



export type NodeClickHandler = (
  node: LocationNode,
  layer: L.CircleMarker,
  map: L.Map
) => void;


export function ensureNodePanes(map: L.Map) {
  if (!map.getPane("edges")) {
    map.createPane("edges");
    map.getPane("edges")!.style.zIndex = "350";
  }

  if (!map.getPane("nodes")) {
    map.createPane("nodes");
    map.getPane("nodes")!.style.zIndex = "450";
  }
}



export function renderNodes(
  L: any,
  map: L.Map,
  nodes: LocationNode[],
  onNodeClick?: NodeClickHandler
) {
  ensureNodePanes(map);

  const bounds: [number, number][] = [];

  const nodeById = new Map<number, LocationNode>(
    nodes.map((n) => [n.id, n])
  );

  const edgeLayer = L.layerGroup([], { pane: "edges" }).addTo(map);
  const nodeLayer = L.layerGroup([], { pane: "nodes" }).addTo(map);

  /* ---------- EDGES (behind nodes) ---------- */
  nodes.forEach((node) => {
    if (node.nextId == null) return;

    const next = nodeById.get(node.nextId);
    if (!next) return;

    L.polyline(
      [
        [node.position.latitude, node.position.longitude],
        [next.position.latitude, next.position.longitude],
      ],
      {
        pane: "edges",
        color: "#059669",
        weight: 4,
        opacity: 0.9,
      }
    ).addTo(edgeLayer);
  });

  /* ---------- NODES ---------- */
  nodes.forEach((node) => {
    const point: [number, number] = [
      node.position.latitude,
      node.position.longitude,
    ];

    const isClassNode =
      node.tags.includes("class") ||
      node.tags.includes("destination");

    const marker = L.circleMarker(point, {
      pane: "nodes",
      radius: isClassNode ? 8 : 4,
      color: isClassNode ? "#B91C1C" : "#1D4ED8",
      fillColor: isClassNode ? "#EF4444" : "#60A5FA",
      fillOpacity: 0.95,
      weight: 2,
    }).addTo(nodeLayer);

    if (onNodeClick) {
      marker.on("click", () => onNodeClick(node, marker, map));
    }

    bounds.push(point);
  });

  return {
    nodeLayer,
    edgeLayer,
    bounds,
  };
}