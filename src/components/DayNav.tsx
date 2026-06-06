"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import schedule from "@/data/schedule.json";

const dotColors: Record<string, string> = {
  emerald: "bg-emerald-400",
  blue: "bg-blue-400",
  amber: "bg-amber-400",
  violet: "bg-violet-400",
};

export default function DayNav() {
  const pathname = usePathname();
  const { days } = schedule;
  const isSchedule = pathname === "/";
  const isCalendar = pathname === "/calendar";

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-11">
          {/* View tabs */}
          <div className="flex items-center gap-0.5 bg-zinc-900/80 rounded-lg p-0.5">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                isSchedule
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Schedule
            </Link>
            <Link
              href="/calendar"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                isCalendar
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </Link>
          </div>

          {/* Day anchors — only on schedule page */}
          {isSchedule && (
            <div className="flex items-center gap-0.5 overflow-x-auto">
              {days.map((day) => (
                <a
                  key={day.id}
                  href={`#${day.id}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors whitespace-nowrap"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${dotColors[day.color] || "bg-zinc-400"}`} />
                  <span className="hidden sm:inline">Day</span> {day.dayNumber}
                  <span className="hidden md:inline text-zinc-600 ml-0.5">
                    {day.date.split(",")[0]}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
