export default function PropiedadesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-36 bg-slate-200 rounded animate-pulse" />
        <div className="h-9 w-36 bg-slate-200 rounded-lg animate-pulse" />
      </div>
      <div className="h-10 bg-slate-200 rounded-lg mb-6 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse"
          >
            <div className="h-44 bg-slate-100" />
            <div className="p-4 space-y-2.5">
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-5 bg-slate-100 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
