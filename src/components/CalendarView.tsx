"use client";

import { useState, useMemo } from "react";
import schedule from "@/data/schedule.json";

/* ── helpers ── */

function parseTime(time: string): number | null {
  // Handle "Morning", "Evening", etc.
  if (!/\d/.test(time)) return null;

  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function parseDuration(dur: string): number {
  if (!dur) return 30;
  const hourMatch = dur.match(/(\d+)\s*hour/i);
  const minMatch = dur.match(/(\d+)\s*min/i);
  let total = 0;
  if (hourMatch) total += parseInt(hourMatch[1], 10) * 60;
  if (minMatch) total += parseInt(minMatch[1], 10);
  return total || 30;
}

function formatTimeShort(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return m === 0 ? `${displayH} ${period}` : `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}

interface SessionBlock {
  time: string;
  startMin: number;
  durationMin: number;
  title: string;
  owner: string;
  format: string;
  description: string;
  type: string;
  track?: "cf" | "station";
}

const typeColorMap: Record<string, { bg: string; border: string; text: string; hover: string }> = {
  keynote: { bg: "bg-amber-500/15", border: "border-amber-500/40", text: "text-amber-300", hover: "hover:bg-amber-500/25" },
  workshop: { bg: "bg-sky-500/15", border: "border-sky-500/40", text: "text-sky-300", hover: "hover:bg-sky-500/25" },
  activity: { bg: "bg-pink-500/15", border: "border-pink-500/40", text: "text-pink-300", hover: "hover:bg-pink-500/25" },
  social: { bg: "bg-purple-500/15", border: "border-purple-500/40", text: "text-purple-300", hover: "hover:bg-purple-500/25" },
  session: { bg: "bg-zinc-500/10", border: "border-zinc-500/30", text: "text-zinc-300", hover: "hover:bg-zinc-500/20" },
  logistics: { bg: "bg-zinc-500/8", border: "border-zinc-600/20", text: "text-zinc-500", hover: "hover:bg-zinc-500/15" },
  break: { bg: "bg-zinc-800/20", border: "border-zinc-700/20", text: "text-zinc-600", hover: "" },
  buffer: { bg: "bg-zinc-800/10", border: "border-zinc-800/20", text: "text-zinc-700", hover: "" },
  end: { bg: "bg-transparent", border: "border-zinc-700/20", text: "text-zinc-600", hover: "" },
};

const dayColors: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  violet: "bg-violet-500",
};

const HOUR_HEIGHT = 80; // px per hour
const START_HOUR = 9; // 9 AM
const END_HOUR = 21; // 9 PM
const TOTAL_HOURS = END_HOUR - START_HOUR;

export default function CalendarView() {
  const [selectedDay, setSelectedDay] = useState(0);
  const { days } = schedule;

  // Process each day's sessions into positioned blocks
  const processedDays = useMemo(() => {
    return days.map((day) => {
      const jointBlocks: SessionBlock[] = [];
      const cfBlocks: SessionBlock[] = [];
      const stationBlocks: SessionBlock[] = [];
      let hasSplitTracks = false;

      for (const session of day.sessions) {
        if (session.type === "splitTrack") {
          hasSplitTracks = true;
          const split = session as {
            type: "splitTrack";
            time: string;
            cf: { room: string; sessions: Array<{ time: string; duration: string; title: string; owner: string; format: string; description: string; type?: string }> };
            station: { room: string; sessions: Array<{ time: string; duration: string; title: string; owner: string; format: string; description: string; type?: string }> };
          };

          for (const s of split.cf.sessions) {
            const startMin = parseTime(s.time);
            if (startMin === null) continue;
            cfBlocks.push({
              time: s.time,
              startMin,
              durationMin: parseDuration(s.duration),
              title: s.title,
              owner: s.owner,
              format: s.format,
              description: s.description,
              type: s.type || "session",
              track: "cf",
            });
          }

          for (const s of split.station.sessions) {
            const startMin = parseTime(s.time);
            if (startMin === null) continue;
            stationBlocks.push({
              time: s.time,
              startMin,
              durationMin: parseDuration(s.duration),
              title: s.title,
              owner: s.owner,
              format: s.format,
              description: s.description,
              type: s.type || "session",
              track: "station",
            });
          }
        } else {
          const startMin = parseTime(session.time);
          if (startMin === null) continue;
          jointBlocks.push({
            time: session.time,
            startMin,
            durationMin: parseDuration(session.duration || ""),
            title: session.title || "",
            owner: session.owner || "",
            format: session.format || "",
            description: session.description || "",
            type: session.type || "session",
          });
        }
      }

      return { day, jointBlocks, cfBlocks, stationBlocks, hasSplitTracks };
    });
  }, [days]);

  const timeSlots = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i);

  return (
    <div>
      {/* Mobile day selector */}
      <div className="flex md:hidden items-center gap-1 px-4 py-3 overflow-x-auto bg-zinc-950/50 border-b border-zinc-800/40">
        {days.map((day, i) => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedDay === i
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${dayColors[day.color] || "bg-zinc-400"}`} />
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Desktop: all days side-by-side | Mobile: selected day */}
      <div className="flex">
        {/* Time gutter */}
        <div className="shrink-0 w-16 sm:w-20 pt-10 border-r border-zinc-800/40">
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="relative"
              style={{ height: `${HOUR_HEIGHT}px` }}
            >
              <span className="absolute -top-2.5 right-3 text-[10px] font-mono text-zinc-600">
                {formatTimeShort(hour * 60)}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex min-w-0">
            {processedDays.map(({ day, jointBlocks, cfBlocks, stationBlocks, hasSplitTracks }, dayIndex) => (
              <div
                key={day.id}
                className={`flex-1 min-w-[200px] border-r border-zinc-800/30 last:border-r-0 ${
                  // On mobile, show only selected day
                  dayIndex !== selectedDay ? "hidden md:block" : ""
                }`}
              >
                {/* Day column header */}
                <div className="h-10 flex items-center justify-center gap-2 border-b border-zinc-800/40 bg-zinc-950/50 sticky top-11 z-10">
                  <div className={`w-1.5 h-1.5 rounded-full ${dayColors[day.color] || "bg-zinc-400"}`} />
                  <span className="text-xs font-semibold text-zinc-300">Day {day.dayNumber}</span>
                  <span className="text-[10px] text-zinc-600 hidden lg:inline">{day.date.split(",")[0]}</span>
                </div>

                {/* Time grid */}
                <div className="relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
                  {/* Hour lines */}
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-zinc-800/30"
                      style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
                    />
                  ))}

                  {/* Joint session blocks */}
                  {jointBlocks.map((block, i) => (
                    <CalendarBlock
                      key={`j-${i}`}
                      block={block}
                      left="4px"
                      right={hasSplitTracks ? "4px" : "4px"}
                    />
                  ))}

                  {/* CF track blocks (left half) */}
                  {cfBlocks.map((block, i) => (
                    <CalendarBlock
                      key={`cf-${i}`}
                      block={block}
                      left="4px"
                      right="50%"
                      trackLabel="CF"
                    />
                  ))}

                  {/* STATION track blocks (right half) */}
                  {stationBlocks.map((block, i) => (
                    <CalendarBlock
                      key={`st-${i}`}
                      block={block}
                      left="50%"
                      right="4px"
                      trackLabel="STA"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarBlock({
  block,
  left,
  right,
  trackLabel,
}: {
  block: SessionBlock;
  left: string;
  right: string;
  trackLabel?: string;
}) {
  const colors = typeColorMap[block.type] || typeColorMap.session;
  const isMinor = block.type === "break" || block.type === "buffer" || block.type === "end";
  const topPx = ((block.startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const heightPx = Math.max((block.durationMin / 60) * HOUR_HEIGHT, 18);

  const trackBorder =
    block.track === "cf"
      ? "border-l-2 border-l-red-500/60"
      : block.track === "station"
      ? "border-l-2 border-l-violet-500/60"
      : "";

  if (isMinor) {
    return (
      <div
        className={`absolute overflow-hidden rounded ${colors.bg} ${colors.border} border ${trackBorder}`}
        style={{
          top: `${topPx}px`,
          height: `${heightPx}px`,
          left,
          right,
        }}
      >
        <div className="px-1.5 py-0.5">
          <span className={`text-[9px] italic ${colors.text} truncate block`}>
            {block.title}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`calendar-block absolute overflow-hidden rounded-md border ${colors.bg} ${colors.border} ${colors.hover} ${trackBorder} transition-colors cursor-default group`}
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
        left,
        right,
      }}
    >
      <div className="px-2 py-1 h-full flex flex-col">
        <div className="flex items-start gap-1">
          {trackLabel && (
            <span className={`text-[8px] font-bold uppercase shrink-0 mt-px ${
              block.track === "cf" ? "text-red-400/70" : "text-violet-400/70"
            }`}>
              {trackLabel}
            </span>
          )}
          <span className={`text-[11px] font-semibold leading-tight ${colors.text} line-clamp-2`}>
            {block.title}
          </span>
        </div>
        {heightPx > 36 && block.owner && (
          <span className="text-[9px] text-zinc-500 mt-0.5 truncate">{block.owner}</span>
        )}
        {heightPx > 50 && (
          <span className="text-[9px] text-zinc-600 mt-auto truncate">{block.time}</span>
        )}
      </div>

      {/* Hover tooltip */}
      <div className="calendar-tooltip absolute z-30 left-0 right-0 top-full mt-1 mx-1 p-3 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl">
        <p className="text-xs font-semibold text-zinc-100">{block.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-zinc-400">{block.time}</span>
          {block.owner && (
            <>
              <span className="text-zinc-700">--</span>
              <span className="text-[10px] text-zinc-400">{block.owner}</span>
            </>
          )}
        </div>
        {block.format && (
          <span className={`inline-block text-[9px] mt-1.5 px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
            {block.format}
          </span>
        )}
        {block.description && (
          <p className="text-[10px] text-zinc-500 leading-relaxed mt-1.5 line-clamp-4">
            {block.description}
          </p>
        )}
      </div>
    </div>
  );
}
