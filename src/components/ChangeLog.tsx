import schedule from "@/data/schedule.json";

const typeColors: Record<string, string> = {
  "must-fix": "bg-red-900/50 text-red-300 border-red-800/50",
  timing: "bg-amber-900/50 text-amber-300 border-amber-800/50",
  cleanup: "bg-zinc-700/50 text-zinc-300 border-zinc-600/50",
};

export default function ChangeLog() {
  const { changeLog } = schedule;
  if (!changeLog || changeLog.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold text-zinc-200 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Change Log — Josh Feedback Applied
      </h2>
      <div className="space-y-2">
        {changeLog.map((entry) => {
          const colors = typeColors[entry.type] || typeColors.cleanup;
          return (
            <div
              key={entry.fix}
              className={`flex items-start gap-3 px-4 py-3 rounded border ${colors}`}
            >
              <span className="text-xs font-mono font-bold shrink-0 mt-0.5">
                #{entry.fix}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider shrink-0 mt-0.5 w-[70px]">
                {entry.type.replace("-", " ")}
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {entry.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
