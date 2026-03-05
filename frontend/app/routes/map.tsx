import type { Route } from "./+types/map";
import React, { useEffect, useRef } from "react";




export function meta({}: Route.MetaArgs) {
  return [
    { title: "Map Page" },
    { name: "description", content: "View the map" },
  ];
}

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: any;

    (async () => {
      // Dynamically import Leaflet on the client only
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!mapRef.current) return;

      map = L.map(mapRef.current).setView([48.463206449716026, -123.3122201865843], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
    })();

    return () => {
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
