import type { Track } from '../lib/model';

import { BassGrid } from './BassGrid';
import { TrackHeader } from './TrackHeader';

type TrackViewProps = {
  track: Track;
  onClose?: () => void;
};

export function TrackView({ track, onClose }: TrackViewProps) {
  return (
    <div className="mockup-window border border-base-300 bg-base-100 shadow-xl">
      <div className="bg-base-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-circle btn-xs border border-base-300 bg-error/70 text-base-100"
              onClick={onClose}
              aria-label={`Close ${track.title}`}
              disabled={!onClose}
            />
            <div className="h-3 w-3 rounded-full border border-base-300 bg-warning/70" />
            <div className="h-3 w-3 rounded-full border border-base-300 bg-success/70" />
          </div>
        </div>

        <div className="mt-4">
          <TrackHeader track={track} />
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <BassGrid track={track} />
        </div>
      </div>
    </div>
  );
}
