import type { LocationNode } from "~/types/LocationNode";




const entranceIcon = (L: any) =>
  L.icon({
    iconUrl: "/icons/entrance.png",
    iconSize: [25, 41], iconAnchor: [12, 41],
    popupAnchor: [0, -28],
});

const classIcon = (L: any) =>
  L.icon({
    iconUrl: "/icons/class.png",
    iconSize: [25, 41], iconAnchor: [12, 41],
    popupAnchor: [0, -26],
});

function GetMarker(L: any, nodeLayer: any, node: LocationNode): L.Marker | L.CircleMarker {
  const point: [number, number] = [
    node.position.latitude,
    node.position.longitude,
  ];

  if (node.tags.includes("building")) {
    // return L.marker(point, {
    //   pane: "nodes",
    //   icon: entranceIcon(L),
    // }).addTo(nodeLayer);
    return L.circleMarker(point, {
      pane: "nodes",
      radius: 6,
      color: "#abca38",
      fillColor: "#f1ff33",
      fillOpacity: 0.95,
      weight: 2,
    }).addTo(nodeLayer);
  }

  if (node.tags.includes("class")) {
    // return L.marker(point, {
    //   pane: "nodes",
    //   icon: classIcon(L),
    // }).addTo(nodeLayer);
    return L.circleMarker(point, {
      pane: "nodes",
      radius: 8,
      color: "#B91C1C",
      fillColor: "#EF4444",
      fillOpacity: 0.95,
      weight: 2,
    }).addTo(nodeLayer);
  }

  if (node.tags.includes("REDIRECT")) {
    // return L.marker(point, {
    //   pane: "nodes",
    //   icon: entranceIcon(L),
    // }).addTo(nodeLayer);
    return L.circleMarker(point, {
      pane: "nodes",
      radius: 6,
      color: "#60b97e",
      fillColor: "#1af563",
      fillOpacity: 0.95,
      weight: 2,
    }).addTo(nodeLayer);
  }
  
  


  return L.circleMarker(point, {
    pane: "nodes",
    radius: 4,
    color: "#1D4ED8",
    fillColor: "#60A5FA",
    fillOpacity: 0.95,
    weight: 2,
  }).addTo(nodeLayer);
}




export type NodeClickHandler = (
  node: LocationNode,
  layer: L.Marker | L.CircleMarker,
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

    const marker = GetMarker(L, nodeLayer, node);
    // const marker = L.circleMarker(point, {
    //   pane: "nodes",
    //   radius: isClassNode ? 8 : 4,
    //   color: isClassNode ? "#B91C1C" : "#1D4ED8",
    //   fillColor: isClassNode ? "#EF4444" : "#60A5FA",
    //   fillOpacity: 0.95,
    //   weight: 2,
    // }).addTo(nodeLayer);

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