import { useMemo } from "react";

type CalendarRowProps = {
    date : Date;
}
export default function CalendarRow({ date } : CalendarRowProps) {

  // Create an array of 7 dates centered around today
  const week = useMemo(() => {
    const days: Date[] = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(date);
      d.setDate(date.getDate() + i);
      days.push(d);
    }
    return days;
  }, [date]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex justify-center items-center gap-3 p-1 bg-base-200 rounded shadow-sm">
      {week.map((d) => {
        const isToday =
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear();

        return (
          <div
            key={d.toDateString()}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded cursor-pointer transition ${
              isToday ? "bg-primary text-white shadow-lg" : "hover:bg-primary/20"
            }`}
          >
            <span className="text-xs font-medium text-gray-700">{daysOfWeek[d.getDay()]}</span>
            <span className="text-sm font-bold mt-0.5">{d.getDate()}</span>
          </div>
        );
      })}
    </div>
  );
}