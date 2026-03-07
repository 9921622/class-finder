import type { Route } from "./+types/map";
import React, { useEffect, useRef } from "react";
import { mapAPI } from "~/APIWrapper";
import type { LocationNode } from "~/types/LocationNode";
import { rotatedOverlayFromCenter } from "~/map/rotateOverlay";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Map Page" },
    { name: "description", content: "View the map" },
  ];
}





function CreateMap(L: any, mapRef: any) {
  const baseLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
    minZoom: 0,
    maxZoom: 24,        // clamp tile requests
    maxNativeZoom: 19,  // stretch tiles beyond this
    }
  );

  const map = L.map(mapRef.current, {
    maxZoom: 24,
    layers: [baseLayer],
    }).setView(
      // [48.463206449716026, -123.3122201865843],
      [48.46114, -123.31053],
      15
  );

  return map;
}

function CreateOverlay(L: any) {
  var layerControl = L.control.layers({}, {});


  const ELW_1f = rotatedOverlayFromCenter(
    L,
    "/elw1rstfloor.png",
    [48.461, -123.3105], // center of building
    139, 100,
    { yawDeg: 12 }, 
    { scale: 1, opacity: 0.5 }
  );

  const ELW_2f = rotatedOverlayFromCenter(
    L,
    "/elw2ndfloor.png",
    [48.461, -123.3105], // center of building
    139, 100,
    { yawDeg: 12 }, 
    { scale: 1, opacity: 0.5 }
  );


  layerControl.addOverlay(L.layerGroup([ELW_1f]), "Floor 1");
  layerControl.addOverlay(L.layerGroup([ELW_2f]), "Floor 2");
  return layerControl;
}








export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any;
    let cancelled = false;

    (async () => {
      // Dynamically import Leaflet on the client only
      const L = (await import("leaflet")).default;
      await import("leaflet-imageoverlay-rotated");
      await import("leaflet/dist/leaflet.css");
      if (!mapRef.current) return;



      map = CreateMap(L, mapRef);
      CreateOverlay(L).addTo(map);
      

      const { data: nodes } = await mapAPI.queryNodes({tags:["map_v1"]});
      if (cancelled) return;

      const bounds: [number, number][] = [];

      nodes.forEach((node: LocationNode) => {
        const point: [number, number] = [
          node.position.latitude,
          node.position.longitude,
        ];

        const isClassNode = node.tags.includes("class") || node.tags.includes("destination");

        L.circleMarker(point, {
          radius: isClassNode ? 8 : 4,
          color: isClassNode ? "#B91C1C" : "#1D4ED8",
          fillColor: isClassNode ? "#EF4444" : "#60A5FA",
          fillOpacity: 0.95,
          weight: 2,
        })
          .addTo(map)
          .bindPopup(`<strong>${node.name}</strong><br />Node ID: ${node.id}`);

        bounds.push(point);
      });

      // Draw directed path segments based on route links between nodes.
      const nodeById = new Map<number, LocationNode>(nodes.map((node) => [node.id, node]));
      nodes.forEach((node) => {
        if (node.nextId === null) return;
        const next = nodeById.get(node.nextId);
        if (!next) return;

        L.polyline(
          [
            [node.position.latitude, node.position.longitude],
            [next.position.latitude, next.position.longitude],
          ],
          {
            color: "#480202",
            weight: 5,
            opacity: 0.9,
          }
        ).addTo(map);
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1>Map Page</h1>
      <div
        ref={mapRef}
        className="relative z-0"
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
}
