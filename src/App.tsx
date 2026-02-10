function App() {
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
            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase text-base-content/60">Track View</p>
                    <h1 className="mt-2 text-3xl font-semibold">No track loaded</h1>
                    <p className="mt-1 text-base text-base-content/60">
                      This view will populate once external tracks are wired up.
                    </p>
                  </div>
                  <div className="badge badge-outline">Placeholder</div>
                </div>

                <div className="rounded-xl border border-dashed border-base-300 bg-base-200 px-6 py-10 text-center">
                  <p className="text-sm text-base-content/60">
                    Add your track library and we’ll render it here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="drawer-side">
          <label htmlFor="track-drawer" className="drawer-overlay" aria-label="Close sidebar" />
          <aside className="min-h-full w-72 bg-base-100 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">Tracks</h2>
              <label htmlFor="track-drawer" className="btn btn-circle btn-ghost btn-xs lg:hidden">
                ✕
              </label>
            </div>
            <ul className="menu mt-4 rounded-box bg-base-200 p-2 text-sm">
              <li>
                <span className="text-base-content/60">Track list will appear here.</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
