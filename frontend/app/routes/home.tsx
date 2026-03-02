import axios from "axios";
import React, { useEffect, useState } from "react";
import type { Route } from "./+types/home";

import type { ClassItem } from "~/components/classtimeline";
import { Timeline } from "~/components/classtimeline";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [classes, setClasses] = useState<ClassItem[]>([]);

  // get class
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get<ClassItem[]>(`${import.meta.env.VITE_API_URL}/users/1/classes`);
        setClasses(res.data);
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Today's Classes</h1>
      <Timeline classes={classes} />
    </div>
  )
}
