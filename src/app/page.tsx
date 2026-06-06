import schedule from "@/data/schedule.json";
import Header from "@/components/Header";
import DayNav from "@/components/DayNav";
import DaySection from "@/components/DaySection";
import ChangeLog from "@/components/ChangeLog";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <DayNav />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {schedule.days.map((day) => (
          <DaySection key={day.id} day={day} />
        ))}
        <div id="changelog">
          <ChangeLog />
        </div>
        <footer className="text-center text-xs text-zinc-600 py-8 border-t border-zinc-800">
          DREAMCON S26 Run of Show — Last updated June 6, 2026
        </footer>
      </main>
    </div>
  );
}
