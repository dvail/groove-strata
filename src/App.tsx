import psychoKiller from './lib/examples/talking-heads---psycho-killer.json';
import majorScale from './lib/examples/major-scale-c.json';
import minorScale from './lib/examples/minor-scale-a.json';
import type { Track } from './lib/model';

import { Legend } from './components/Legend';
import { TrackView } from './components/TrackView';

function App() {
  const track = psychoKiller as Track;
  const scaleTrack = majorScale as Track;
  const minorScaleTrack = minorScale as Track;

  return (
    <div data-theme="cupcake" className="min-h-screen">
      <div className="container mx-auto flex flex-col gap-8 px-6 py-12">
        <Legend />
        <TrackView track={track} />
        <TrackView track={scaleTrack} />
        <TrackView track={minorScaleTrack} />
      </div>
    </div>
  );
}

export default App;
