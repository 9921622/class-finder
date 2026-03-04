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

export function getLocationNodeByTags(tags: string[]): LocationNode[] {
  if (!tags || tags.length === 0) return [];

  return locationNodes.filter(node =>
    node.tags.some(tag => tags.includes(tag))
  );
}

export function getAllLocationNodes(): readonly LocationNode[] {
  return locationNodes;
}

export function unionLocationNodeArrays(arrays: LocationNode[][]): LocationNode[] {
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

export function intersectLocationNodeArrays(arrays: LocationNode[][]): LocationNode[] {
  if (arrays.length === 0) return [];

  // Start with the first array
  let intersection = arrays[0];

  // For each subsequent array, keep only nodes whose id exists in all arrays
  for (let i = 1; i < arrays.length; i++) {
    const currentIds = new Set(arrays[i].map(n => n.id));
    intersection = intersection.filter(n => currentIds.has(n.id));
  }

  return intersection;
}
