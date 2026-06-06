import SessionRow from "./SessionRow";

interface TrackSession {
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

interface SplitTrackData {
  type: "splitTrack";
  time: string;
  label: string;
  cf: {
    room: string;
    sessions: TrackSession[];
  };
  station: {
    room: string;
    sessions: TrackSession[];
  };
}

export default function SplitTrack({ data }: { data: SplitTrackData }) {
  return (
    <div className="my-3">
      {/* Split banner */}
      <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/60 rounded-t-lg border border-zinc-800/60 border-b-0">
        <svg className="w-3.5 h-3.5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Split Tracks
        </span>
        <span className="text-[10px] text-zinc-600 font-mono">{data.time}</span>
        {data.label && (
          <span className="text-[10px] text-zinc-600 hidden sm:inline">-- {data.label}</span>
        )}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 border border-zinc-800/60 rounded-b-lg overflow-hidden">
        {/* CF Track */}
        <div className="border-b md:border-b-0 md:border-r border-zinc-800/60">
          <div className="px-4 py-2 bg-red-950/30 border-b border-red-900/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="text-[10px] font-bold text-red-400/90 uppercase tracking-wider">
                CF Track
              </span>
              <span className="text-[10px] text-red-400/40 font-mono">{data.cf.room}</span>
            </div>
          </div>
          <div className="space-y-px bg-zinc-950/30">
            {data.cf.sessions.map((s, i) => (
              <SessionRow key={i} session={s} />
            ))}
          </div>
        </div>

        {/* STATION Track */}
        <div>
          <div className="px-4 py-2 bg-violet-950/30 border-b border-violet-900/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500/80" />
              <span className="text-[10px] font-bold text-violet-400/90 uppercase tracking-wider">
                STATION Track
              </span>
              <span className="text-[10px] text-violet-400/40 font-mono">{data.station.room}</span>
            </div>
          </div>
          <div className="space-y-px bg-zinc-950/30">
            {data.station.sessions.map((s, i) => (
              <SessionRow key={i} session={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
