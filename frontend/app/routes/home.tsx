import React, { useEffect, useState } from "react";
import type { Route } from "./+types/home";

import { usersAPI } from "~/APIWrapper";
import type { Class } from "~/types/Class";
import { Timeline } from "~/components/classtimeline";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [classes, setClasses] = useState<Class[]>([]);

  // get class
  useEffect(() => {
    const fetch = async () => {
      const res = await usersAPI.getClasses();
      setClasses(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Today's Classes</h1>
      <Timeline classes={classes} />
    </div>
  )
}
