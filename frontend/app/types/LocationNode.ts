
export type LatLang = {
    lat: number;
    lng: number;
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