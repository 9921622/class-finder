
export type LatLang = {
    latitude: number;
    longitude: number;
};
export type LocationNode = {
    id: number;
    prevId: number | null;
    nextId: number | null;

    name: string;
    image: TexImageSource | null;
    tags: string[];
    position: LatLang;
};