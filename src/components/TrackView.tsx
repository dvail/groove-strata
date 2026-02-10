import type { Track } from '../lib/model';

import { BassGrid } from './BassGrid';
import { TrackHeader } from './TrackHeader';

type TrackViewProps = {
  track: Track;
  onClose?: () => void;
};

export function TrackView({ track, onClose }: TrackViewProps) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="tooltip tooltip-bottom flex items-center" data-tip="Close track">
              <button
                type="button"
                className="h-4 w-4 cursor-pointer rounded-full border border-base-300 bg-error/70"
                onClick={onClose}
                aria-label={`Close ${track.title}`}
                disabled={!onClose}
              />
            </div>
            <div className="h-4 w-4 rounded-full border border-base-300 bg-warning/70" />
            <div className="h-4 w-4 rounded-full border border-base-300 bg-success/70" />
          </div>
        </div>

        <TrackHeader track={track} />

        <div className="flex flex-col gap-6">
          <BassGrid track={track} />
        </div>
      </div>
    </div>
  );
}
