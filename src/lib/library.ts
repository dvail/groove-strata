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

export const getDefaultLibraryBaseUrl = () =>
  (import.meta.env.VITE_LIBRARY_BASE_URL || DEFAULT_LIBRARY_BASE_URL).replace(/\/$/, '');

export const getIndexUrl = (baseUrl: string) => `${baseUrl.replace(/\/$/, '')}/index.json`;

export const fetchTrackIndex = async (baseUrl: string) => {
  const response = await fetch(getIndexUrl(baseUrl));
  if (!response.ok) {
    throw new Error(`Failed to load track index: ${response.status}`);
  }
  return (await response.json()) as TrackIndex;
};

export const fetchTrackJson = async (baseUrl: string, path: string) => {
  const url = `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load track: ${response.status}`);
  }
  return response.json();
};
