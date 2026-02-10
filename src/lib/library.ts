export type TrackIndexEntry = {
  id: string;
  title: string;
  artist: string;
  tonic: number | null;
  tonicMidi: number | null;
  mode: string | null;
  tempoBpm: number | null;
  lengthBars: number | null;
  path: string;
};

export type TrackIndex = {
  generatedAt: string;
  trackCount: number;
  tracks: TrackIndexEntry[];
};

const DEFAULT_LIBRARY_BASE_URL = 'https://raw.githubusercontent.com/dvail/groove-strata-library/main';

export const getLibraryBaseUrl = () => (import.meta.env.VITE_LIBRARY_BASE_URL || DEFAULT_LIBRARY_BASE_URL).replace(/\/$/, '');

export const getIndexUrl = () => `${getLibraryBaseUrl()}/index.json`;

export const fetchTrackIndex = async () => {
  const response = await fetch(getIndexUrl());
  if (!response.ok) {
    throw new Error(`Failed to load track index: ${response.status}`);
  }
  return (await response.json()) as TrackIndex;
};

export const fetchTrackJson = async (path: string) => {
  const url = `${getLibraryBaseUrl()}/${path.replace(/^\//, '')}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load track: ${response.status}`);
  }
  return response.json();
};
