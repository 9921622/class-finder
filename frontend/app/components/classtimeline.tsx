import React from "react";

// 1️⃣ Define the type for a class
export type ClassItem = {
  name: string;
  building: string;
  location: string;
  start: string;
  end: string;
};

// 2️⃣ Props for the Timeline component
type TimelineProps = {
  classes: ClassItem[];
};

// 3️⃣ Timeline component
export function Timeline({ classes }: TimelineProps) {
  return (
    <ul className="timeline timeline-vertical w-full max-w-md mx-auto">
      {classes.map((cls, idx) => (
        <li key={`${cls.name}-${cls.start}`}>
          {/* optional hr line between items */}
          {idx !== 0 && <hr />}

          {/* left side: start time */}
          <div className="timeline-start font-semibold">{cls.start}</div>

          {/* middle circle icon */}
          <div className="timeline-middle">
            <div className="bg-primary h-5 w-5 rounded-full"></div>
          </div>

          {/* right side: class card */}
          <div className="timeline-end timeline-box p-3 bg-base-200 rounded-md shadow-md">
            <h3 className="font-bold">{cls.name}</h3>
            <p className="text-sm text-gray-600">{cls.building}</p>
            <p className="text-sm text-gray-600">{cls.location}</p>
            <p className="text-xs text-gray-500">
              {cls.start} - {cls.end}
            </p>
          </div>

          {/* optional hr line after item */}
          {idx !== classes.length - 1 && <hr />}
        </li>
      ))}
    </ul>
  );
}