"use client";

import { useState } from "react";
import SessionRow from "./SessionRow";
import SplitTrack from "./SplitTrack";

interface DayData {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  attire: string;
  trackMode: string;
  color: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sessions: any[];
}

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; dot: string }> = {
  emerald: {
    bg: "bg-gradient-to-r from-emerald-900/80 to-emerald-800/60",
    border: "border-emerald-600/50",
    text: "text-emerald-300",
    badge: "bg-emerald-900/60 text-emerald-300",
    dot: "bg-emerald-400",
  },
  blue: {
    bg: "bg-gradient-to-r from-blue-900/80 to-blue-800/60",
    border: "border-blue-600/50",
    text: "text-blue-300",
    badge: "bg-blue-900/60 text-blue-300",
    dot: "bg-blue-400",
  },
  amber: {
    bg: "bg-gradient-to-r from-amber-900/80 to-amber-800/60",
    border: "border-amber-600/50",
    text: "text-amber-300",
    badge: "bg-amber-900/60 text-amber-300",
    dot: "bg-amber-400",
  },
  violet: {
    bg: "bg-gradient-to-r from-violet-900/80 to-violet-800/60",
    border: "border-violet-600/50",
    text: "text-violet-300",
    badge: "bg-violet-900/60 text-violet-300",
    dot: "bg-violet-400",
  },
};

export default function DaySection({ day }: { day: DayData }) {
  const [expanded, setExpanded] = useState(true);
  const c = colorMap[day.color] || colorMap.blue;

  return (
    <section id={day.id} className="scroll-mt-4">
      {/* Day Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full ${c.bg} border ${c.border} rounded-lg px-5 py-4 text-left transition-all hover:brightness-110 cursor-pointer`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">
                  Day {day.dayNumber}
                </h2>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
                  {day.date}
                </span>
              </div>
              <p className={`text-sm font-medium mt-0.5 ${c.text}`}>
                {day.title}
              </p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-zinc-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {(day.theme || day.attire) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 ml-[22px]">
            {day.theme && (
              <span className="text-xs text-zinc-400">
                <span className="text-zinc-500">Theme:</span> {day.theme}
              </span>
            )}
            {day.attire && (
              <span className="text-xs text-zinc-400">
                <span className="text-zinc-500">Attire:</span> {day.attire}
              </span>
            )}
            {day.trackMode && (
              <span className="text-xs text-zinc-400">
                <span className="text-zinc-500">Tracks:</span> {day.trackMode}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Sessions */}
      {expanded && (
        <div className="mt-1 space-y-0.5">
          {day.sessions.map((session, i) => {
            if (session.type === "splitTrack") {
              return <SplitTrack key={i} data={session} />;
            }
            return <SessionRow key={i} session={session} />;
          })}
        </div>
      )}
    </section>
  );
}
