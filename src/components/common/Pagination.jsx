import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const delta = 2;
  const pages = [];
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: '#EDF0F8' }}>
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold">{from}</span>–<span className="font-semibold">{to}</span>{' '}
        of <span className="font-semibold">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <MdChevronLeft className="text-xl" />
        </button>

        {page > 3 && (
          <>
            <PageBtn num={1} current={page} onClick={onPageChange} />
            <span className="text-slate-400 px-1 text-sm">…</span>
          </>
        )}

        {pages.map((p) => (
          <PageBtn key={p} num={p} current={page} onClick={onPageChange} />
        ))}

        {page < totalPages - 2 && (
          <>
            <span className="text-slate-400 px-1 text-sm">…</span>
            <PageBtn num={totalPages} current={page} onClick={onPageChange} />
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <MdChevronRight className="text-xl" />
        </button>
      </div>
    </div>
  );
}

function PageBtn({ num, current, onClick }) {
  const isActive = num === current;
  return (
    <button
      onClick={() => onClick(num)}
      className="w-8 h-8 text-sm rounded-lg font-medium transition-colors"
      style={{
        backgroundColor: isActive ? '#0D1B5E' : 'transparent',
        color: isActive ? '#FFFFFF' : '#4A5578',
      }}
    >
      {num}
    </button>
  );
}
