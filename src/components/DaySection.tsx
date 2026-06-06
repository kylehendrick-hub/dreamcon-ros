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
    bg: "bg-gradient-to-r from-emerald-950/80 to-emerald-900/30",
    border: "border-emerald-800/40",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
    dot: "bg-emerald-400",
  },
  blue: {
    bg: "bg-gradient-to-r from-blue-950/80 to-blue-900/30",
    border: "border-blue-800/40",
    text: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
    dot: "bg-blue-400",
  },
  amber: {
    bg: "bg-gradient-to-r from-amber-950/80 to-amber-900/30",
    border: "border-amber-800/40",
    text: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
    dot: "bg-amber-400",
  },
  violet: {
    bg: "bg-gradient-to-r from-violet-950/80 to-violet-900/30",
    border: "border-violet-800/40",
    text: "text-violet-400",
    badge: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",
    dot: "bg-violet-400",
  },
};

export default function DaySection({ day }: { day: DayData }) {
  const [expanded, setExpanded] = useState(true);
  const c = colorMap[day.color] || colorMap.blue;

  return (
    <section id={day.id} className="scroll-mt-12">
      {/* Day Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full ${c.bg} border ${c.border} rounded-xl px-5 py-4 text-left transition-all hover:brightness-110 cursor-pointer`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${c.dot} ring-2 ring-current/10`} />
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Day {day.dayNumber}
                </h2>
                <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${c.badge}`}>
                  {day.date}
                </span>
              </div>
              <p className={`text-sm mt-0.5 ${c.text}`}>
                {day.title}
              </p>
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {(day.theme || day.attire || day.trackMode) && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2.5 ml-5">
            {day.theme && (
              <span className="text-[11px] text-zinc-400">
                <span className="text-zinc-600">Theme</span>{" "}
                {day.theme}
              </span>
            )}
            {day.attire && (
              <span className="text-[11px] text-zinc-400">
                <span className="text-zinc-600">Attire</span>{" "}
                {day.attire}
              </span>
            )}
            {day.trackMode && (
              <span className="text-[11px] text-zinc-400">
                <span className="text-zinc-600">Tracks</span>{" "}
                {day.trackMode}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Sessions */}
      {expanded && (
        <div className="mt-2 space-y-px">
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
