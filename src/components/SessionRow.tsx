interface Session {
  time: string;
  duration: string;
  title: string;
  owner: string;
  format: string;
  description: string;
  logistics: string;
  type?: string;
  fix?: number;
  fixNote?: string;
}

const typeStyles: Record<string, string> = {
  break:
    "bg-zinc-800/30 border-l-zinc-600",
  buffer:
    "bg-zinc-800/20 border-l-zinc-700",
  end:
    "bg-zinc-800/40 border-l-zinc-500",
  keynote:
    "bg-zinc-800/60 border-l-amber-500",
  workshop:
    "bg-zinc-800/60 border-l-sky-500",
  activity:
    "bg-zinc-800/60 border-l-pink-500",
  social:
    "bg-zinc-800/60 border-l-purple-500",
  logistics:
    "bg-zinc-800/30 border-l-zinc-600",
  session:
    "bg-zinc-800/50 border-l-zinc-400",
};

const formatBadgeColors: Record<string, string> = {
  "Presentation": "bg-blue-900/50 text-blue-300",
  "Presentation + Q&A": "bg-blue-900/50 text-blue-300",
  "CEO keynote": "bg-amber-900/50 text-amber-300",
  "CEO closing": "bg-amber-900/50 text-amber-300",
  "Competition": "bg-pink-900/50 text-pink-300",
  "Competition + celebration": "bg-pink-900/50 text-pink-300",
  "Interactive presentation": "bg-emerald-900/50 text-emerald-300",
  "Hands-on workshop": "bg-sky-900/50 text-sky-300",
  "Live workshop": "bg-sky-900/50 text-sky-300",
  "Live demos + workshop": "bg-sky-900/50 text-sky-300",
  "Team competition + AI build": "bg-sky-900/50 text-sky-300",
  "Small-group working sessions": "bg-teal-900/50 text-teal-300",
  "Structured 1-on-1 walk": "bg-green-900/50 text-green-300",
  "Awards ceremony": "bg-yellow-900/50 text-yellow-300",
  "Social event": "bg-purple-900/50 text-purple-300",
  "Personal reflection": "bg-indigo-900/50 text-indigo-300",
  "Open Q&A": "bg-orange-900/50 text-orange-300",
};

export default function SessionRow({ session }: { session: Session }) {
  const t = session.type || "session";
  const style = typeStyles[t] || typeStyles.session;
  const isBreak = t === "break" || t === "buffer";
  const isEnd = t === "end";

  if (isBreak) {
    return (
      <div className={`flex items-center gap-3 px-4 py-2 border-l-4 rounded-r ${style}`}>
        <span className="text-xs font-mono text-zinc-500 w-[72px] shrink-0">
          {session.time}
        </span>
        <span className="text-xs text-zinc-500 w-[52px] shrink-0">
          {session.duration}
        </span>
        <span className="text-sm text-zinc-500 italic">
          {session.title}
          {session.description && ` — ${session.description}`}
        </span>
      </div>
    );
  }

  if (isEnd) {
    return (
      <div className={`flex items-center gap-3 px-4 py-2 border-l-4 rounded-r ${style}`}>
        <span className="text-xs font-mono text-zinc-400 w-[72px] shrink-0">
          {session.time}
        </span>
        <span className="text-sm font-semibold text-zinc-400">{session.title}</span>
      </div>
    );
  }

  const badgeColor = session.format
    ? formatBadgeColors[session.format] || "bg-zinc-700/50 text-zinc-400"
    : null;

  return (
    <div className={`border-l-4 rounded-r px-4 py-3 ${style} ${session.fix ? "ring-1 ring-amber-500/30" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
        {/* Time + Duration */}
        <div className="flex items-baseline gap-2 shrink-0">
          <span className="text-sm font-mono font-semibold text-zinc-200 w-[72px]">
            {session.time}
          </span>
          <span className="text-xs text-zinc-500 w-[52px]">{session.duration}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-100">{session.title}</h3>
            {session.fix && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300">
                FIX #{session.fix}
                {session.fixNote && ` — ${session.fixNote}`}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1">
            {session.owner && (
              <span className="text-xs text-zinc-400">
                {session.owner}
              </span>
            )}
            {session.owner && session.format && (
              <span className="text-zinc-600">·</span>
            )}
            {badgeColor && session.format && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
                {session.format}
              </span>
            )}
          </div>

          {session.description && (
            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
              {session.description}
            </p>
          )}

          {session.logistics && (
            <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
              <span className="font-semibold text-zinc-400">Logistics:</span>{" "}
              {session.logistics}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
