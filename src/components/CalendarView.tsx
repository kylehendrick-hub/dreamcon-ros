"use client";

import { useState, useMemo } from "react";
import schedule from "@/data/schedule.json";

/* ── helpers ── */

function parseTime(time: string): number | null {
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

const typeColorMap: Record<string, { bg: string; border: string; text: string }> = {
  keynote: { bg: "bg-amber-500/20", border: "border-l-amber-400", text: "text-amber-200" },
  workshop: { bg: "bg-sky-500/20", border: "border-l-sky-400", text: "text-sky-200" },
  activity: { bg: "bg-pink-500/20", border: "border-l-pink-400", text: "text-pink-200" },
  social: { bg: "bg-purple-500/20", border: "border-l-purple-400", text: "text-purple-200" },
  session: { bg: "bg-zinc-500/15", border: "border-l-zinc-400", text: "text-zinc-200" },
  logistics: { bg: "bg-zinc-500/10", border: "border-l-zinc-600", text: "text-zinc-400" },
  break: { bg: "bg-zinc-800/30", border: "border-l-zinc-700", text: "text-zinc-500" },
  buffer: { bg: "bg-zinc-800/20", border: "border-l-zinc-700", text: "text-zinc-600" },
  end: { bg: "bg-transparent", border: "border-l-zinc-700", text: "text-zinc-600" },
};

const dayDotColors: Record<string, string> = {
  emerald: "bg-emerald-400",
  blue: "bg-blue-400",
  amber: "bg-amber-400",
  violet: "bg-violet-400",
};

const dayBorderColors: Record<string, string> = {
  emerald: "border-emerald-500/30",
  blue: "border-blue-500/30",
  amber: "border-amber-500/30",
  violet: "border-violet-500/30",
};

const HOUR_HEIGHT = 140; // px per hour — generous spacing
const START_HOUR = 9;
const END_HOUR = 21;
const TOTAL_HOURS = END_HOUR - START_HOUR;

export default function CalendarView() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const { days } = schedule;

  const processedDays = useMemo(() => {
    return days.map((day) => {
      const jointBlocks: SessionBlock[] = [];
      const cfBlocks: SessionBlock[] = [];
      const stationBlocks: SessionBlock[] = [];

      for (const session of day.sessions) {
        if (session.type === "splitTrack") {
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
              time: s.time, startMin, durationMin: parseDuration(s.duration),
              title: s.title, owner: s.owner, format: s.format, description: s.description,
              type: s.type || "session", track: "cf",
            });
          }
          for (const s of split.station.sessions) {
            const startMin = parseTime(s.time);
            if (startMin === null) continue;
            stationBlocks.push({
              time: s.time, startMin, durationMin: parseDuration(s.duration),
              title: s.title, owner: s.owner, format: s.format, description: s.description,
              type: s.type || "session", track: "station",
            });
          }
        } else {
          const startMin = parseTime(session.time);
          if (startMin === null) continue;
          jointBlocks.push({
            time: session.time, startMin, durationMin: parseDuration(session.duration || ""),
            title: session.title || "", owner: session.owner || "", format: session.format || "",
            description: session.description || "", type: session.type || "session",
          });
        }
      }

      return { day, jointBlocks, cfBlocks, stationBlocks };
    });
  }, [days]);

  const timeSlots = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i);

  const current = processedDays[selectedDay];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Day selector tabs */}
      <div className="flex items-center gap-2 mb-6">
        {days.map((day, i) => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(i)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedDay === i
                ? "bg-zinc-800 text-white ring-1 ring-zinc-700"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${dayDotColors[day.color] || "bg-zinc-400"}`} />
            Day {day.dayNumber}
            <span className={`hidden sm:inline ${selectedDay === i ? "text-zinc-400" : "text-zinc-600"}`}>
              {day.date.split(",")[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Day title */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">
          Day {current.day.dayNumber} — {current.day.date}
        </h2>
        <p className="text-sm text-zinc-500 mt-1">{current.day.title}</p>
      </div>

      {/* Calendar grid */}
      <div className="flex rounded-xl border border-zinc-800/60 bg-zinc-950/50 overflow-hidden">
        {/* Time gutter */}
        <div className="shrink-0 w-20 bg-zinc-950/80 border-r border-zinc-800/60">
          {/* Spacer for header */}
          <div className="h-0" />
          {timeSlots.map((hour, i) => {
            const h = hour > 12 ? hour - 12 : hour;
            const ampm = hour >= 12 ? "PM" : "AM";
            return (
              <div
                key={hour}
                className="relative"
                style={{ height: i < timeSlots.length - 1 ? `${HOUR_HEIGHT}px` : "0px" }}
              >
                <div className="absolute -top-3 right-4 flex items-baseline gap-0.5">
                  <span className="text-sm font-mono font-medium text-zinc-400">{h}</span>
                  <span className="text-[10px] font-mono text-zinc-600">{ampm}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main calendar area */}
        <div className="flex-1 relative" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT}px` }}>
          {/* Hour gridlines */}
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0 border-t border-zinc-800/40"
              style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
            />
          ))}
          {/* Half-hour gridlines */}
          {timeSlots.slice(0, -1).map((hour) => (
            <div
              key={`half-${hour}`}
              className="absolute left-0 right-0 border-t border-zinc-800/20 border-dashed"
              style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2}px` }}
            />
          ))}

          {/* Split track columns — show CF | STATION labels when there are split sessions */}
          {(current.cfBlocks.length > 0 || current.stationBlocks.length > 0) && (
            <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none">
              <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-zinc-700/30" />
            </div>
          )}

          {/* Joint session blocks — full width */}
          {current.jointBlocks.map((block, i) => {
            const isMinor = block.type === "break" || block.type === "buffer" || block.type === "end";
            return (
              <BlockCard
                key={`j-${i}`}
                block={block}
                isMinor={isMinor}
                style={{
                  left: "6px",
                  right: "6px",
                }}
                hovered={hoveredBlock === `j-${i}`}
                onHover={() => setHoveredBlock(`j-${i}`)}
                onLeave={() => setHoveredBlock(null)}
                dayColor={current.day.color}
              />
            );
          })}

          {/* CF track blocks — left half */}
          {current.cfBlocks.map((block, i) => {
            const isMinor = block.type === "break" || block.type === "buffer" || block.type === "end";
            return (
              <BlockCard
                key={`cf-${i}`}
                block={block}
                isMinor={isMinor}
                style={{
                  left: "6px",
                  right: "calc(50% + 3px)",
                }}
                trackLabel="CF"
                trackColor="red"
                hovered={hoveredBlock === `cf-${i}`}
                onHover={() => setHoveredBlock(`cf-${i}`)}
                onLeave={() => setHoveredBlock(null)}
                dayColor={current.day.color}
              />
            );
          })}

          {/* STATION track blocks — right half */}
          {current.stationBlocks.map((block, i) => {
            const isMinor = block.type === "break" || block.type === "buffer" || block.type === "end";
            return (
              <BlockCard
                key={`st-${i}`}
                block={block}
                isMinor={isMinor}
                style={{
                  left: "calc(50% + 3px)",
                  right: "6px",
                }}
                trackLabel="STATION"
                trackColor="violet"
                hovered={hoveredBlock === `st-${i}`}
                onHover={() => setHoveredBlock(`st-${i}`)}
                onLeave={() => setHoveredBlock(null)}
                dayColor={current.day.color}
              />
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 px-1">
        {[
          { label: "Keynote", color: "bg-amber-400" },
          { label: "Workshop", color: "bg-sky-400" },
          { label: "Activity", color: "bg-pink-400" },
          { label: "Social", color: "bg-purple-400" },
          { label: "Session", color: "bg-zinc-400" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
            <span className="text-xs text-zinc-500">{item.label}</span>
          </div>
        ))}
        {(current.cfBlocks.length > 0 || current.stationBlocks.length > 0) && (
          <>
            <div className="w-px h-4 bg-zinc-800 self-center" />
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-400" />
              <span className="text-xs text-zinc-500">CF Track</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-violet-400" />
              <span className="text-xs text-zinc-500">STATION Track</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Block card component ── */

function BlockCard({
  block,
  isMinor,
  style,
  trackLabel,
  trackColor,
  hovered,
  onHover,
  onLeave,
  dayColor,
}: {
  block: SessionBlock;
  isMinor: boolean;
  style: React.CSSProperties;
  trackLabel?: string;
  trackColor?: string;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  dayColor: string;
}) {
  const colors = typeColorMap[block.type] || typeColorMap.session;
  const topPx = ((block.startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const heightPx = Math.max((block.durationMin / 60) * HOUR_HEIGHT, 24);
  const isSmall = heightPx < 50;
  const isTiny = heightPx < 30;

  const trackBorderClass = trackColor === "red"
    ? "border-l-red-400"
    : trackColor === "violet"
    ? "border-l-violet-400"
    : colors.border;

  const borderClass = dayBorderColors[dayColor] || "border-zinc-800/60";

  if (isMinor) {
    return (
      <div
        className="absolute flex items-center px-2 overflow-hidden"
        style={{ top: `${topPx}px`, height: `${heightPx}px`, ...style }}
      >
        <span className="text-[10px] text-zinc-600 italic truncate">
          {block.title === "Break" ? "—" : block.title}
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`absolute border-l-3 rounded-r-md overflow-hidden cursor-default transition-all ${colors.bg} ${trackBorderClass} ${
          hovered ? "ring-1 ring-white/20 z-20 brightness-125" : `border border-l-0 ${borderClass}`
        }`}
        style={{ top: `${topPx}px`, height: `${heightPx}px`, ...style }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div className={`h-full flex flex-col px-2.5 ${isTiny ? "py-0.5 justify-center" : "py-1.5"}`}>
          {/* Track label */}
          {trackLabel && !isTiny && (
            <span className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${
              trackColor === "red" ? "text-red-400/60" : "text-violet-400/60"
            }`}>
              {trackLabel}
            </span>
          )}

          {/* Title */}
          <div className="flex items-start gap-1.5 min-w-0">
            {trackLabel && isTiny && (
              <span className={`text-[8px] font-bold uppercase shrink-0 ${
                trackColor === "red" ? "text-red-400/60" : "text-violet-400/60"
              }`}>
                {trackLabel === "STATION" ? "STA" : trackLabel}
              </span>
            )}
            <span className={`font-semibold leading-tight ${colors.text} ${isTiny ? "text-[10px]" : isSmall ? "text-xs" : "text-sm"} ${isTiny ? "truncate" : "line-clamp-2"}`}>
              {block.title}
            </span>
          </div>

          {/* Owner + time */}
          {!isSmall && (
            <div className="flex items-center gap-2 mt-1">
              {block.owner && (
                <span className="text-[11px] text-zinc-400 truncate">{block.owner}</span>
              )}
            </div>
          )}

          {/* Time at bottom */}
          {!isSmall && (
            <span className="text-[10px] text-zinc-600 mt-auto pt-1">{block.time} · {block.durationMin} min</span>
          )}
        </div>
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div
          className="fixed z-50 w-80 p-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl pointer-events-none"
          style={{
            top: `${Math.min(topPx + 40, TOTAL_HOURS * HOUR_HEIGHT - 200)}px`,
            left: "50%",
            transform: "translateX(-50%)",
            position: "absolute",
          }}
        >
          <h3 className={`text-sm font-bold ${colors.text}`}>{block.title}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-zinc-300">{block.time}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-400">{block.durationMin} min</span>
            {block.owner && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="text-xs text-zinc-400">{block.owner}</span>
              </>
            )}
          </div>
          {block.format && (
            <span className={`inline-block text-[10px] mt-2 px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} ring-1 ring-white/10`}>
              {block.format}
            </span>
          )}
          {block.description && (
            <p className="text-xs text-zinc-400 leading-relaxed mt-2">
              {block.description}
            </p>
          )}
        </div>
      )}
    </>
  );
}
