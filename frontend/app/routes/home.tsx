import React, { useEffect, useState } from "react";
import type { Route } from "./+types/home";

import { usersAPI } from "~/APIWrapper";
import type { Class } from "~/types/Class";
import { Timeline } from "~/components/classtimeline";
import CalendarRow from "~/components/CalendarRow";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Class Finder" },
    { name: "description", content: "See your schedule" },
  ];
}

export default function Home() {
  const today = new Date();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  // get class
  useEffect(() => {
    const fetch = async () => {
      const res = await usersAPI.getClasses();
      setClasses(res.data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="">

      <div className="flex flex-col items-center w-16 p-4">
        <div className="text-gray-400 text-sm font-semibold whitespace-nowrap">
          { today.toLocaleDateString("en-US", { day: "numeric", month: "long" }) }
        </div>
        <div className="text-lg font-bold mt-1">Today</div>
      </div>

      <CalendarRow date={today} />
      {
        loading ?
          (<div className="flex items-center justify-center w-full h-full mt-8">
          <div className="skeleton w-64 h-100 flex items-center justify-center">
            <span className="loading loading-spinner loading-xl"></span>
          </div>
          </div>) :
          (<Timeline classes={classes} />)
      }
      
    </div>
  )
}
