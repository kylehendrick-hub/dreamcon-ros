import Header from "@/components/Header";
import DayNav from "@/components/DayNav";
import CalendarView from "@/components/CalendarView";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <DayNav />
      <main className="max-w-7xl mx-auto">
        <CalendarView />
        <footer className="text-center text-[10px] text-zinc-700 py-8 border-t border-zinc-900">
          DREAMCON S26 Run of Show
        </footer>
      </main>
    </div>
  );
}
