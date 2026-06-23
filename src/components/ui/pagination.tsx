import Link from "next/link";

export default function Pagination({
  total,
  pageSize,
  currentPage,
  searchParams,
}: {
  total: number;
  pageSize: number;
  currentPage: number;
  searchParams: Record<string, string>;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  function pageHref(page: number) {
    const params = new URLSearchParams(searchParams);
    if (page === 1) params.delete("pagina");
    else params.set("pagina", String(page));
    const qs = params.toString();
    return `/propiedades${qs ? `?${qs}` : ""}`;
  }

  // Show window of ±2 pages around current
  const pages: number[] = [];
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    pages.push(i);
  }

  const btnBase =
    "px-3 py-2 rounded-lg text-sm border transition-colors";
  const btnActive =
    "bg-slate-900 text-white border-slate-900";
  const btnIdle =
    "border-slate-200 text-slate-700 hover:bg-slate-50 bg-white";
  const btnDisabled =
    "pointer-events-none opacity-40 border-slate-200 text-slate-400 bg-white";

  return (
    <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
      <Link
        href={pageHref(currentPage - 1)}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnIdle}`}
      >
        ← Anterior
      </Link>

      {pages[0] > 1 && (
        <>
          <Link href={pageHref(1)} className={`${btnBase} ${btnIdle}`}>1</Link>
          {pages[0] > 2 && <span className="px-1 text-slate-400 text-sm">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(p)}
          className={`${btnBase} ${p === currentPage ? btnActive : btnIdle}`}
        >
          {p}
        </Link>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-slate-400 text-sm">…</span>
          )}
          <Link href={pageHref(totalPages)} className={`${btnBase} ${btnIdle}`}>
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={pageHref(currentPage + 1)}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnIdle}`}
      >
        Siguiente →
      </Link>
    </div>
  );
}
