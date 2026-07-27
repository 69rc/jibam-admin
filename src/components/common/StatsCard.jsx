/**
 * StatsCard — Dashboard KPI tile using Jibam brand colors
 */
export default function StatsCard({ title, value, icon: Icon, color = 'navy', change, changeLabel }) {
  const colorMap = {
    navy:   { bg: '#E8ECF8', text: '#0D1B5E', border: '#C5CFEE' },
    cyan:   { bg: '#E0F5FD', text: '#0090CC', border: '#B3E7FA' },
    green:  { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' },
    yellow: { bg: '#FEF9C3', text: '#854D0E', border: '#FEF08A' },
    red:    { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
    purple: { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' },
    orange: { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA' },
  };

  const c = colorMap[color] || colorMap.navy;

  return (
    <div className="card flex items-start gap-4">
      {/* Icon box */}
      <div
        className="p-3 rounded-xl border flex-shrink-0"
        style={{ backgroundColor: c.bg, borderColor: c.border }}
      >
        <Icon className="text-2xl" style={{ color: c.text }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
        <p className="text-2xl font-bold mt-0.5" style={{ color: '#0D1B5E' }}>{value}</p>
        {change !== undefined && (
          <p className={`text-xs mt-1 font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% {changeLabel || 'vs last month'}
          </p>
        )}
      </div>
    </div>
  );
}
