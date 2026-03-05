import type { Route } from "./+types/map";
import React, { useEffect, useRef } from "react";
import { mapAPI } from "~/APIWrapper";
import type { LocationNode } from "~/types/LocationNode";




export function meta({}: Route.MetaArgs) {
  return [
    { title: "Map Page" },
    { name: "description", content: "View the map" },
  ];
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any;
    let cancelled = false;

    (async () => {
      // Dynamically import Leaflet on the client only
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!mapRef.current) return;

      map = L.map(mapRef.current).setView([48.463206449716026, -123.3122201865843], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const { data: nodes } = await mapAPI.getAllNodes();
      if (cancelled) return;

      const bounds: [number, number][] = [];

      nodes.forEach((node: LocationNode) => {
        const point: [number, number] = [
          node.position.latitude,
          node.position.longitude,
        ];

        const isClassNode = node.tags.includes("class") || node.tags.includes("destination");

        L.circleMarker(point, {
          radius: isClassNode ? 8 : 6,
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
            color: "#059669",
            weight: 4,
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
        style={{ height: "500px", width: "100%" }}
      />
    </div>
  );
}
