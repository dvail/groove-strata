import type { Track } from '../lib/model';

const PITCH_CLASS_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

type TrackHeaderProps = {
  track: Track;
};

export function TrackHeader({ track }: TrackHeaderProps) {
  const tonicName = PITCH_CLASS_NAMES[track.tonic] ?? '—';

  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div>
        <p className="text-xs uppercase text-base-content/60">Track View</p>
        <h1 className="mt-2 text-3xl font-semibold">{track.title}</h1>
        <p className="mt-1 text-base text-base-content/60">{track.artist ?? 'Unknown Artist'}</p>
      </div>
      <div className="stats stats-vertical bg-base-100 shadow lg:stats-horizontal">
        <div className="stat">
          <div className="stat-title">Tonic</div>
          <div className="stat-value text-xl">{tonicName}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Tempo</div>
          <div className="stat-value text-xl">{track.tempoBpm ?? '—'}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Bars</div>
          <div className="stat-value text-xl">{track.length.bars}</div>
        </div>
      </div>
    </div>
  );
}
