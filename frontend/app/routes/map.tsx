import type { Route } from "./+types/map";
import React from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Map Page" },
    { name: "description", content: "View the map" },
  ];
}

export default function Map() {
  return (
    <div className="container mx-auto p-4">
      <h1>Map Page</h1>
      <p>This is where the map will go.</p>
    </div>
  );
}
