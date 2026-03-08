import React from "react";
import type { Class } from "~/types/Class";




type ClassCardProp = {
  cls: Class; // renamed prop
}

function ClassCard({ cls } : ClassCardProp) {
  return (
    <>
    <h3 className="font-bold">{cls.name}</h3>
    <p className="text-sm text-gray-600">{cls.building}</p>
    <p className="text-sm text-gray-600">{cls.location}</p>
    <p className="text-xs text-gray-500">
      {cls.start} - {cls.end}
    </p>
    </>
  );
}

type TimelineProps = {
  classes: Class[];
};
export function Timeline({ classes }: TimelineProps) {
  return (
    <ul className="timeline timeline-vertical w-full max-w-md mx-auto flex">
      {classes.map((cls, idx) => (
        <li key={`${cls.name}-${cls.start}`}>
          {idx !== 0 && <hr />}

          <div className="flex-1 timeline-start flex flex-col text-right mr-3">
            <div className="text-lg font-bold">{cls.start}</div>
            <div className="text-sm text-gray-400">{cls.end}</div>
          </div>
          
          <div className="flex-1 timeline-middle">
            <div className="bg-primary h-5 w-5 rounded-full"></div>
          </div>

          <div className="flex-2 timeline-end timeline-box p-3 bg-base-200 rounded-md shadow-md w-36">
          <ClassCard cls={cls} />
          </div>


          {idx !== classes.length - 1 && <hr />}
        </li>
      ))}
    </ul>
  );
}