import { GRID_STEP_VAR, INTERVALS } from '../lib/intervals';

type LegendProps = {
  title?: string;
};

export function Legend({ title = 'Intervals' }: LegendProps) {
  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">{title}</h2>
          <span className="text-xs text-base-content/50">Tonal-centric</span>
        </div>
        <div className="flex flex-wrap gap-4">
          {INTERVALS.map((interval) => (
            <div key={interval.semitones} className="flex flex-col items-center gap-2">
              <div
                className="rounded-full"
                style={{
                  width: `var(${GRID_STEP_VAR})`,
                  height: `var(${GRID_STEP_VAR})`,
                  backgroundColor: `var(${interval.cssVar})`,
                }}
                aria-label={interval.label}
                title={interval.label}
              />
              <span className="text-xs uppercase tracking-wide text-base-content/60">{interval.shortLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
