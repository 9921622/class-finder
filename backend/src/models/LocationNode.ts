const locationNodes: LocationNode[] = [];

export type LatLang = {
  latitude: number;
  longitude: number;
};

export class LocationNode {
  constructor(
    public id: number,
    public prevId: number | null,
    public nextId: number | null,

    public name: string,
    public image: TexImageSource | null,
    public tags: string[],
    public position: LatLang
  ) {}
}

export function createLocationNode(
  name: string,
  position: LatLang,
  options?: {
    prevId?: number | null;
    nextId?: number | null;
    image?: TexImageSource | null;
    tags?: string[];
  }
): LocationNode {
  const node = new LocationNode(
    locationNodes.length,
    options?.prevId ?? null,
    options?.nextId ?? null,
    name,
    options?.image ?? null,
    options?.tags ?? [],
    position
  );

  locationNodes.push(node);
  return node;
}


export function getLocationNodeById(id: number): LocationNode[] {
  return locationNodes.filter(n => n.id === id);
}

export function getLocationNodeByName(name: string): LocationNode[] {
  const regex = new RegExp(name, "i");
  return locationNodes.filter(n => regex.test(n.name));
}

export function getAllLocationNodes(): readonly LocationNode[] {
  return locationNodes;
}

export function mergeLocationNodeArrays(arrays: LocationNode[][]): LocationNode[] {
  const merged: LocationNode[] = [];

  for (const arr of arrays) {
    for (const node of arr) {
      // Only add if merged doesn't already contain this node by id
      if (!merged.find(n => n.id === node.id)) {
        merged.push(node);
      }
    }
  }

  return merged;
}
