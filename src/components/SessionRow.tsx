interface Session {
  time: string;
  duration: string;
  title: string;
  owner: string;
  format: string;
  description: string;
  logistics: string;
  type?: string;
}

const typeStyles: Record<string, { row: string; border: string }> = {
  break: {
    row: "bg-transparent",
    border: "border-l-zinc-700/50",
  },
  buffer: {
    row: "bg-transparent",
    border: "border-l-zinc-800/50",
  },
  end: {
    row: "bg-transparent",
    border: "border-l-zinc-600/50",
  },
  keynote: {
    row: "bg-zinc-900/40 hover:bg-zinc-800/50",
    border: "border-l-amber-500",
  },
  workshop: {
    row: "bg-zinc-900/40 hover:bg-zinc-800/50",
    border: "border-l-sky-500",
  },
  activity: {
    row: "bg-zinc-900/40 hover:bg-zinc-800/50",
    border: "border-l-pink-500",
  },
  social: {
    row: "bg-zinc-900/40 hover:bg-zinc-800/50",
    border: "border-l-purple-500",
  },
  logistics: {
    row: "bg-transparent",
    border: "border-l-zinc-700/50",
  },
  session: {
    row: "bg-zinc-900/30 hover:bg-zinc-800/40",
    border: "border-l-zinc-500",
  },
};

const formatBadgeColors: Record<string, string> = {
  "Presentation": "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
  "Presentation + Q&A": "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
  "CEO keynote": "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
  "CEO closing": "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
  "Competition": "bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/20",
  "Competition + celebration": "bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/20",
  "Interactive presentation": "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
  "Hands-on workshop": "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20",
  "Live workshop": "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20",
  "Live demos + workshop": "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20",
  "Team competition + AI build": "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20",
  "Small-group working sessions": "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20",
  "Structured 1-on-1 walk": "bg-green-500/10 text-green-400 ring-1 ring-green-500/20",
  "Awards ceremony": "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/20",
  "Social event": "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20",
  "Personal reflection": "bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20",
  "Open Q&A": "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20",
};

export default function SessionRow({ session, compact }: { session: Session; compact?: boolean }) {
  const t = session.type || "session";
  const style = typeStyles[t] || typeStyles.session;
  const isBreak = t === "break" || t === "buffer";
  const isEnd = t === "end";

  if (isBreak) {
    return (
      <div className="flex items-center gap-3 px-4 py-1.5 border-l-2 border-l-zinc-800/40 ml-[1px]">
        <span className="text-[11px] font-mono text-zinc-600 w-[68px] shrink-0 tabular-nums">
          {session.time}
        </span>
        <span className="text-[11px] text-zinc-700 w-[48px] shrink-0">
          {session.duration}
        </span>
        <span className="text-xs text-zinc-600 italic">
          {session.title}
          {session.description && (
            <span className="text-zinc-700"> -- {session.description}</span>
          )}
        </span>
      </div>
    );
  }

  if (isEnd) {
    return (
      <div className="flex items-center gap-3 px-4 py-1.5 border-l-2 border-l-zinc-700/40 ml-[1px]">
        <span className="text-[11px] font-mono text-zinc-600 w-[68px] shrink-0 tabular-nums">
          {session.time}
        </span>
        <span className="text-xs font-medium text-zinc-600 uppercase tracking-wider">
          {session.title}
        </span>
      </div>
    );
  }

  const badgeColor = session.format
    ? formatBadgeColors[session.format] || "bg-zinc-500/10 text-zinc-400 ring-1 ring-zinc-500/20"
    : null;

  return (
    <div
      className={`border-l-3 rounded-r-md px-4 py-3 transition-colors ${style.row} ${style.border}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
        {/* Time + Duration */}
        <div className="flex items-baseline gap-2 shrink-0">
          <span className="text-sm font-mono font-medium text-zinc-300 w-[68px] tabular-nums">
            {session.time}
          </span>
          <span className="text-[11px] text-zinc-600 w-[48px]">{session.duration}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-zinc-100 leading-snug">
            {session.title}
          </h3>

          {(session.owner || session.format) && (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {session.owner && (
                <span className="text-xs text-zinc-400">{session.owner}</span>
              )}
              {badgeColor && session.format && (
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeColor}`}
                >
                  {session.format}
                </span>
              )}
            </div>
          )}

          {!compact && session.description && (
            <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
              {session.description}
            </p>
          )}

          {!compact && session.logistics && (
            <p className="mt-1 text-[11px] text-zinc-600 leading-relaxed">
              <span className="font-medium text-zinc-500">Logistics:</span>{" "}
              {session.logistics}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
