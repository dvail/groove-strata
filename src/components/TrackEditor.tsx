import { useEffect, useRef } from 'react';

import type { Track } from '../lib/model';

import { TrackHeader } from './TrackHeader';

type TrackEditorProps = {
  track: Track;
  onClose: () => void;
};

export function TrackEditor({ track, onClose }: TrackEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div ref={containerRef} tabIndex={0} className="card border border-base-300 bg-base-100 shadow-sm outline-none">
      <div className="card-body gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-4 w-4 cursor-pointer rounded-full border border-base-300 bg-error/70"
              onClick={onClose}
              aria-label="Close editor"
            />
            <div className="h-4 w-4 rounded-full border border-base-300 bg-warning/70" />
            <div className="h-4 w-4 rounded-full border border-base-300 bg-success/70" />
          </div>
          <span className="text-xs uppercase text-base-content/50">Edit Mode</span>
        </div>

        <TrackHeader track={track} />

        <div className="rounded-xl border border-dashed border-base-300 bg-base-200 px-6 py-10 text-center">
          <p className="text-sm text-base-content/60">Editor grid coming next.</p>
        </div>
      </div>
    </div>
  );
}
