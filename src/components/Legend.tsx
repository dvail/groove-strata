import { GRID_STEP_VAR, INTERVALS } from '../lib/intervals';

type LegendProps = {
  title?: string;
};

export function Legend({ title = 'Intervals' }: LegendProps) {
  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-100 shadow-sm">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title flex items-center justify-between gap-4 text-sm font-semibold uppercase tracking-wide text-base-content/70">
        <span>{title}</span>
        <span className="text-xs font-normal text-base-content/50">Tonal-centric</span>
      </div>
      <div className="collapse-content">
        <div className="flex flex-wrap gap-4">
          {INTERVALS.map((interval) => (
            <div key={interval.semitones} className="flex flex-col items-center gap-2">
              <div
                className="rounded-full"
                style={{
                  width: `var(${GRID_STEP_VAR})`,
                  height: `var(${GRID_STEP_VAR})`,
                  backgroundColor: `var(${interval.cssVar})`,
                  border: `1px solid var(${interval.borderVar})`,
                }}
                aria-label={interval.label}
                title={interval.label}
              />
              <span className="text-xs text-base-content/60">{interval.shortLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
