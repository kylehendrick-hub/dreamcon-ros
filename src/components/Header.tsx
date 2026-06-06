import schedule from "@/data/schedule.json";

export default function Header() {
  const { event } = schedule;
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-b border-zinc-700/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-violet-900/20" />
      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400 mb-3">
          {event.subtitle}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          {event.name}
        </h1>
        <p className="mt-3 text-lg text-zinc-300">{event.dates}</p>
        <p className="mt-1 text-sm text-zinc-500">{event.location}</p>
      </div>
    </header>
  );
}
