"use client";

import schedule from "@/data/schedule.json";

const dotColors: Record<string, string> = {
  emerald: "bg-emerald-400",
  blue: "bg-blue-400",
  amber: "bg-amber-400",
  violet: "bg-violet-400",
};

export default function DayNav() {
  const { days } = schedule;

  return (
    <nav className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-1 overflow-x-auto">
        {days.map((day) => (
          <a
            key={day.id}
            href={`#${day.id}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            <div className={`w-2 h-2 rounded-full ${dotColors[day.color] || "bg-zinc-400"}`} />
            Day {day.dayNumber}
            <span className="hidden sm:inline text-zinc-600">
              {day.date.split(",")[0]}
            </span>
          </a>
        ))}
        <a
          href="#changelog"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors whitespace-nowrap ml-auto"
        >
          Change Log
        </a>
      </div>
    </nav>
  );
}
