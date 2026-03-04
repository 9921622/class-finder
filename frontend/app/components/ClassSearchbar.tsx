import React, { useEffect, useState } from "react";
import { mapAPI } from "~/APIWrapper";
import type { LocationNode } from "~/types/LocationNode";


export default function Searchbar() {
    const [search, setSearch] = useState(""); 
    const [queryNames, setQueryNames] = useState<LocationNode[]>([]); 

    useEffect(() => {
        // call api
        const fetch = async () => {
          const res = await mapAPI.query({name: search, tags: ["class"]});
          setQueryNames(res.data);
        };

        // 
        const timer = setTimeout(() => {
            if (!search)
                return;

            fetch();

        }, 500);
      }, [search]);
      
    
    return (
        <div className="dropdown w-50 md:w-auto">
        {/* Trigger */}
        <input
            tabIndex={0}
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
            onChange={e => setSearch(e.target.value.trim())}
        />

        {/* Dropdown */}
        <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow"
        >
            {queryNames.map((q) => (

                <li key={q.id}><a>{q.name}</a></li>

            ))}
        </ul>
        </div>
  );
}

