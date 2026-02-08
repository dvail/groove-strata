import type { Track } from '../lib/model';

import { BassGrid } from './BassGrid';
import { TrackHeader } from './TrackHeader';

type TrackViewProps = {
  track: Track;
};

export function TrackView({ track }: TrackViewProps) {
  return (
    <div className="mockup-window border border-base-300 bg-base-100 shadow-xl">
      <div className="bg-base-200 px-6 py-8">
        <TrackHeader track={track} />

        <div className="mt-8 flex flex-col gap-6">
          <BassGrid track={track} />
        </div>
      </div>
    </div>
  );
}
