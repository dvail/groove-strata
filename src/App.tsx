import { useEffect, useMemo, useState } from 'react';

import { Legend } from './components/Legend';
import { TrackEditor } from './components/TrackEditor';
import { TrackView } from './components/TrackView';
import { createEmptyTrack } from './lib/editor';
import { fetchTrackIndex, fetchTrackJson, getDefaultLibraryBaseUrl } from './lib/library';
import type { TrackIndexEntry } from './lib/library';
import type { Track } from './lib/model';

function App() {
  const [tracks, setTracks] = useState<TrackIndexEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openTracks, setOpenTracks] = useState<Track[]>([]);
  const [loadingTrackIds, setLoadingTrackIds] = useState<Set<string>>(new Set());
  const [libraryUrlInput, setLibraryUrlInput] = useState(getDefaultLibraryBaseUrl());
  const [libraryUrl, setLibraryUrl] = useState(getDefaultLibraryBaseUrl());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draftTrack, setDraftTrack] = useState<Track | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchTrackIndex(libraryUrl)
      .then((index) => {
        if (isMounted) {
          setTracks(index.tracks);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setTracks([]);
          setError(err instanceof Error ? err.message : 'Failed to load track index');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [libraryUrl]);

  const openTrackIds = useMemo(() => new Set(openTracks.map((track) => track.id)), [openTracks]);

  const handleOpenTrack = async (entry: TrackIndexEntry) => {
    if (openTrackIds.has(entry.id) || loadingTrackIds.has(entry.id)) {
      return;
    }

    setLoadingTrackIds((prev) => new Set(prev).add(entry.id));
    try {
      const track = (await fetchTrackJson(libraryUrl, entry.path)) as Track;
      setOpenTracks((prev) => [track, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load track');
    } finally {
      setLoadingTrackIds((prev) => {
        const next = new Set(prev);
        next.delete(entry.id);
        return next;
      });
    }
  };

  const handleCloseTrack = (trackId: string) => {
    setOpenTracks((prev) => prev.filter((track) => track.id !== trackId));
  };

  const handleApplyLibraryUrl = () => {
    setLibraryUrl(libraryUrlInput.trim().replace(/\/$/, ''));
  };

  const handleOpenEditor = () => {
    if (isEditorOpen) return;
    setDraftTrack(createEmptyTrack());
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setDraftTrack(null);
  };

  let listItems: React.ReactNode;
  if (isLoading) {
    listItems = (
      <li>
        <span className="text-base-content/60">Loading tracks…</span>
      </li>
    );
  } else if (error) {
    listItems = (
      <li>
        <span className="text-error">{error}</span>
      </li>
    );
  } else if (tracks.length === 0) {
    listItems = (
      <li>
        <span className="text-base-content/60">No tracks available.</span>
      </li>
    );
  } else {
    listItems = tracks.map((track) => {
      const isOpen = openTrackIds.has(track.id);
      const isLoadingTrack = loadingTrackIds.has(track.id);
      return (
        <li key={track.id}>
          <button
            type="button"
            className="justify-between"
            onClick={() => handleOpenTrack(track)}
            disabled={isOpen || isLoadingTrack}
          >
            <span>{track.title}</span>
            <span className="text-xs text-base-content/50">{track.artist}</span>
          </button>
        </li>
      );
    });
  }

  return (
    <div data-theme="cupcake" className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="track-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-none lg:hidden">
              <label htmlFor="track-drawer" className="btn btn-square btn-ghost">
                <span className="text-lg">☰</span>
              </label>
            </div>
            <div className="flex-1 px-2 text-sm uppercase tracking-wide text-base-content/70">
              Groove Strata
            </div>
          </div>

          <div className="container mx-auto flex flex-col gap-8 px-6 py-8">
            {openTracks.length > 0 ? <Legend /> : null}

            {isEditorOpen && draftTrack ? (
              <TrackEditor track={draftTrack} onClose={handleCloseEditor} />
            ) : null}

            {openTracks.length === 0 && !isEditorOpen ? (
              <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase text-base-content/60">Track View</p>
                      <h1 className="mt-2 text-3xl font-semibold">No track loaded</h1>
                      <p className="mt-1 text-base text-base-content/60">
                        Select a track from the library to begin.
                      </p>
                    </div>
                    <div className="badge badge-outline">Placeholder</div>
                  </div>

                  <div className="rounded-xl border border-dashed border-base-300 bg-base-200 px-6 py-10 text-center">
                    <p className="text-sm text-base-content/60">Tracks will render here.</p>
                  </div>
                </div>
              </div>
            ) : null}

            {openTracks.length > 0 ? (
              <div className="flex flex-col gap-6">
                {openTracks.map((track) => (
                  <TrackView key={track.id} track={track} onClose={() => handleCloseTrack(track.id)} />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="drawer-side">
          <label htmlFor="track-drawer" className="drawer-overlay" aria-label="Close sidebar" />
          <aside className="min-h-full w-80 bg-base-100 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">Tracks</h2>
              <label htmlFor="track-drawer" className="btn btn-circle btn-ghost btn-xs lg:hidden">
                ✕
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-base-content/50" htmlFor="library-url">
                Library URL
              </label>
              <div className="join">
                <input
                  id="library-url"
                  className="input input-bordered join-item w-full text-xs"
                  value={libraryUrlInput}
                  onChange={(event) => setLibraryUrlInput(event.target.value)}
                />
                <button type="button" className="btn join-item" onClick={handleApplyLibraryUrl}>
                  Apply
                </button>
              </div>
              {error ? <p className="text-xs text-error">{error}</p> : null}
            </div>

            <ul className="menu mt-4 rounded-box bg-base-200 p-2 text-sm">{listItems}</ul>
          </aside>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary btn-circle fixed bottom-6 right-6 text-xl shadow-lg"
        onClick={handleOpenEditor}
        aria-label="Create track"
      >
        +
      </button>
    </div>
  );
}

export default App;
