import type { Route } from "./+types/map";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { mapAPI } from "~/APIWrapper";
import type { LocationNode } from "~/types/LocationNode";
import { renderNodes } from "~/map/nodeRender";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Map Page" },
    { name: "description", content: "View the map" },
  ];
}



// maps

function BaseMap(L: any, mapRef: any) {
  const baseLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      minZoom: 0,
      maxZoom: 24,
      maxNativeZoom: 19,
    }
  );

  const map = L.map(mapRef.current, {
    maxZoom: 24,
    layers: [baseLayer],
  }).setView([48.46114, -123.31053], 15);

  return map;
}
function CreateCustomMap(L: any, mapRef: any, tileSize : number, gridSize : number, url : string) {

  const map = L.map(mapRef.current, {
      crs: L.CRS.Simple, // Use simple CRS for non-geographical tiles
      minZoom: 0,
      maxZoom: 5,
      zoomControl: true,
      center: [-tileSize*gridSize/2, tileSize*gridSize/2], // center on middle of tile grid
      zoom: 0,
    });

  // 
  const bounds = [
    [0, 0],
    [-tileSize*gridSize, tileSize*gridSize],
  ] as L.LatLngExpression[];
  map.setMaxBounds(bounds);

  // Add custom tile layer
  L.tileLayer(url, {
    minZoom: 0,
    maxZoom: 5,
    maxNativeZoom: 0,
    tileSize: tileSize,
    noWrap: true,
  }).addTo(map);

  return map;
}
function ELW1F_Map(L: any, mapRef: any) {
  return CreateCustomMap(L, mapRef, 32, 6, mapAPI.getTileURL("elw1f"));
}
function ELW2F_Map(L: any, mapRef: any) {
  return CreateCustomMap(L, mapRef, 128, 2, mapAPI.getTileURL("elw2f"));
}


// 
async function nodesFromState(mapState : string) {
  let nodes: LocationNode[] = [];
  switch (mapState) {
    case "BASE": ({ data: nodes } = await mapAPI.queryNodes({ tags: ["map_v2", "OUTSIDE"] })); break;
    case "ELW1F": ({ data: nodes } = await mapAPI.queryNodes({ tags: ["map_v2", "ELW1F"] })); break;
    case "ELW2F": ({ data: nodes } = await mapAPI.queryNodes({ tags: ["map_v2", "ELW2F"] })); break;
  }
  return nodes;
}
function mapFromState(L: any, mapRef: any, mapState : any) {
  let map;
  switch (mapState) {
    case "BASE": map = BaseMap(L, mapRef); break;
    case "ELW1F": map = ELW1F_Map(L, mapRef); break;
    case "ELW2F": map = ELW2F_Map(L, mapRef); break;
  }
  return map;
}



export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  //
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  //
  type MapState = "BASE" | "ELW1F" | "ELW2F";
  const [mapState, setMapState] = useState<MapState>("BASE");
  const [pos, setPos] = useState<[number, number] | null>(null);





  // set map based on search params
  useEffect(() => {
    const paramsMapState = searchParams.get("map");
    if (paramsMapState && ["BASE","ELW1F","ELW2F"].includes(paramsMapState))
      setMapState(paramsMapState as MapState);

    const lat = Number(searchParams.get("latitude"));
    const lng = Number(searchParams.get("longitude"));
    if (!isNaN(lat) && !isNaN(lng))
      setPos([lat, lng]);
    else setPos(null);
  }, [searchParams]);


  // map creation
  useEffect(() => {
    let cancelled = false;

    (async () => {
      //
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (!mapRef.current) return;

      // 
      let nodes: LocationNode[] = await nodesFromState(mapState);
      if (cancelled) return;
      let map = mapFromState(L, mapRef, mapState);
      mapInstanceRef.current = map;

      if (pos && (pos[0] !== 0 || pos[1] !== 0)) 
        map.flyTo(pos, 18);

      // ------------------
      // Right-click listener
      // ------------------
      map.on("contextmenu", (e: L.LeafletMouseEvent) => {
        console.log(
          `Right-click at: { latitude: ${e.latlng.lat}, longitude: ${e.latlng.lng} }`
        );
      });

      // ------------------
      // Render nodes with "Go to map" button
      // ------------------
      renderNodes(L, map, nodes, async (node, layer) => {
        const base = `<strong>${node.name}</strong>`;
        const portal = `<button class="btn btn-success" id="goto-${node.id}">Go to map</button>`
        
        if (node.tags.includes("REDIRECT")) 
          layer.bindPopup(base+"<br>"+portal).openPopup();
        else layer.bindPopup(base).openPopup();

        // Attach click listener to button
        setTimeout(() => {
          const btn = document.getElementById(`goto-${node.id}`);
          btn?.addEventListener("click", () => {
            
            // Determine mapState from node tags
            if (node.tags.includes("R-ELW1F")) setSearchParams({map: "ELW1F"});
            else if (node.tags.includes("R-ELW2F")) setSearchParams({map: "ELW2F"});
            else if (node.tags.includes("R-BASE"))setSearchParams({map: "BASE"});
          });
        }, 0);
        
      });
    })();

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
    };
  }, [mapState, pos]);

  return (
    <div className="container mx-auto p-4">
      <div
        ref={mapRef}
        className="relative z-0"
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
}