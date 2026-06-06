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
    <div className="my-2">
      {/* Split banner */}
      <div className="flex items-center gap-3 px-4 py-2 bg-zinc-800/80 rounded-t border border-zinc-700/50">
        <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          Split Tracks — {data.time}
        </span>
        {data.label && (
          <span className="text-xs text-zinc-500">{data.label}</span>
        )}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-x border-b border-zinc-700/50 rounded-b overflow-hidden">
        {/* CF Track */}
        <div className="border-b md:border-b-0 md:border-r border-zinc-700/50">
          <div className="px-4 py-2 bg-red-950/40 border-b border-red-900/30">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              CF Track
            </span>
            <span className="text-xs text-red-400/60 ml-2">{data.cf.room}</span>
          </div>
          <div className="space-y-0.5 p-1">
            {data.cf.sessions.map((s, i) => (
              <SessionRow key={i} session={s} />
            ))}
          </div>
        </div>

        {/* STATION Track */}
        <div>
          <div className="px-4 py-2 bg-violet-950/40 border-b border-violet-900/30">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
              STATION Track
            </span>
            <span className="text-xs text-violet-400/60 ml-2">{data.station.room}</span>
          </div>
          <div className="space-y-0.5 p-1">
            {data.station.sessions.map((s, i) => (
              <SessionRow key={i} session={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
