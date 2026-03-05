import axios from "axios";

import type { Class } from "./types/Class";
import type { LocationNode } from "./types/LocationNode";



/* 
    purpose of this is so we don't have to manually type the APIRoutes every ime
*/

function stringify(obj : any) {
    return Object.keys(obj)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        .join('&');
}



export const usersAPI = {
    APIUrl() {return `${import.meta.env.VITE_API_URL}/users`},
    getClasses() {
        const res = axios.get<Class[]>(`${this.APIUrl()}/1/classes`);
        return res;
    },
};

export const mapAPI = {
    APIUrl() {return `${import.meta.env.VITE_API_URL}/map/node`},
    getAllNodes() {
        return axios.get<LocationNode[]>(this.APIUrl());
    },
    query(query : {id? : number, name?: string, tags?: string[]}) {
        if (!query.id && !query.name && (!query.tags || query.tags.length === 0))
            throw new Error("ERROR: query is empty");

        
        const queryCopy: Record<string, any> = { ...query };
        if (query.tags) queryCopy.tags = query.tags.join(",");
        
        const q = stringify(queryCopy);
        const res = axios.get<LocationNode[]>(`${this.APIUrl()}?${q}`);
        return res;
    },
}
