function App() {
  return (
    <div data-theme="cupcake" className="min-h-screen">
      <div className="container mx-auto flex flex-col gap-8 px-6 py-12">
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
  );
}

export default App;
