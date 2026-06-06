import schedule from "@/data/schedule.json";

export default function Header() {
  const { event } = schedule;
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/15 via-transparent to-violet-900/15" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4 py-10 sm:py-14 text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 mb-4">
          {event.subtitle}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          {event.name}
        </h1>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span className="text-sm font-medium text-zinc-300">{event.dates}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <span className="text-sm text-zinc-500">{event.location}</span>
        </div>
      </div>
    </header>
  );
}
