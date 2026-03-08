import type { Route } from "./+types/map";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { mapAPI } from "~/APIWrapper";
import type { LocationNode } from "~/types/LocationNode";
import { renderNodes } from "~/map/nodeRender";
import { createRoot } from "react-dom/client";
import type { NavigateFunction, SetURLSearchParams } from "react-router";


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
  const halfSize = tileSize * gridSize * 1.5;
  const bounds: L.LatLngExpression[] = [
    [-halfSize, -halfSize],
    [halfSize, halfSize],
  ];
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

//
type PopupButtonProps = {
  node: LocationNode;
  setSearchParams: SetURLSearchParams;
  navigate : NavigateFunction;
};
function PopupButton({ node, setSearchParams, navigate}: PopupButtonProps) { 
  const goToMap = () => { 
    if (node.tags.includes("R-ELW1F")) setSearchParams({ map: "ELW1F" }); 
    else if (node.tags.includes("R-ELW2F")) setSearchParams({ map: "ELW2F" }); 
    else if (node.tags.includes("R-BASE")) setSearchParams({ map: "BASE" }); 
  }; 

  return (
    <>
    <strong>{node.name}</strong>
    {node.image !== null && (
      <>
      <button onClick={goToMap} className="p-0 border-0 bg-transparent">
        <img
          src={node.image}
          alt={node.name}
          className="rounded cursor-pointer max-w-full max-h-32 object-contain"
        />
      </button>

      <button className="btn btn-secondary" onClick={() => {navigate(`/firstPerson/${node.id}`)}}>View</button>
      </>
    )}

    { node.tags.includes("REDIRECT") &&
        (<button className="btn btn-success" onClick={goToMap}>Enter</button>)
    }
    </>
  ); 
}

type BreadcrumbProps = {
  map: string;
  setSearchParams: SetURLSearchParams;
};
function Breadcrumb({ map, setSearchParams }: BreadcrumbProps) {
  const mapHierarchy = ["BASE", "ELW1F", "ELW2F"];
  const crumbs = mapHierarchy.slice(0, mapHierarchy.indexOf(map) + 1);

  const handleClick = (crumb: string) => {
    setSearchParams({ map: crumb });
  };

  return (
    <div className="breadcrumbs text-sm mb-2">
      <ul className="flex gap-1">
        <li>
          <a className="text-gray-500 hover:underline" onClick={() => handleClick("BASE")}>
            Maps
          </a>
        </li>
        {crumbs.map((crumb, idx) => (
          <li key={crumb}>
            {idx === crumbs.length - 1 ? (
              <span className="font-semibold">{crumb}</span>
            ) : (
              <a
                className="text-blue-600 hover:underline"
                onClick={() => handleClick(crumb)}
              >
                {crumb}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}



export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapRef.current && (mapRef.current as any)._leaflet_id) {
        delete (mapRef.current as any)._leaflet_id;
      }

      // 
      let nodes: LocationNode[] = await nodesFromState(mapState);
      if (cancelled) return;
      let map = mapFromState(L, mapRef, mapState);
      mapInstanceRef.current = map;

      if (pos && (pos[0] !== 0 || pos[1] !== 0)) 
        map.flyTo(pos, 19);

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
        const popupContainer = document.createElement("div");
        popupContainer.className = "w-max whitespace-nowrap flex flex-col gap-2";
        const popup = layer.bindPopup(popupContainer, {  maxWidth: "auto" as any });
        const root = createRoot(popupContainer);

        layer.on("popupopen", () => {
          root.render(<PopupButton node={node} setSearchParams={setSearchParams} navigate={navigate}/>);
          setTimeout(() => {
            layer.getPopup()?.update();
          }, 5);
        });
        popup.openPopup();
      });


    })();

    return () => {
      cancelled = true;
      // mapInstanceRef.current?.remove();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (mapRef.current && (mapRef.current as any)._leaflet_id) {
        delete (mapRef.current as any)._leaflet_id;
      }
    };
  }, [mapState, searchParams]);

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb map={String(mapState)} setSearchParams={setSearchParams}/>

      <div
        ref={mapRef}
        className="relative z-0"
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
}