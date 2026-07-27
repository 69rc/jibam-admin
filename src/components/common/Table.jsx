export default function Table({ columns, data, loading, emptyText = 'No data found' }) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{ borderColor: '#EDF0F8' }}>
          <thead style={{ backgroundColor: '#F4F6FB' }}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: '#0D1B5E' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y" style={{ borderColor: '#F4F6FB' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 rounded-lg animate-pulse" style={{ backgroundColor: '#E8ECF8' }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-5xl mb-3">📭</p>
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y" style={{ borderColor: '#EDF0F8' }}>
        <thead style={{ backgroundColor: '#F4F6FB' }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                style={{ color: '#0D1B5E' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y" style={{ borderColor: '#F4F6FB' }}>
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              className="transition-colors"
              style={{ ':hover': { backgroundColor: '#F4F6FB' } }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F4F6FB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm whitespace-nowrap"
                  style={{ color: '#4A5578' }}
                >
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
