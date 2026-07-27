import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import { dashboardAPI } from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Status → color using Jibam palette
const STATUS_COLORS = {
  pending:          '#F59E0B',
  paid:             '#00AEEF',   /* Cyan */
  processing:       '#8B5CF6',
  ready:            '#06B6D4',
  out_for_delivery: '#F97316',
  delivered:        '#10B981',
  cancelled:        '#EF4444',
};

const PERIODS = ['week', 'month', 'year'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month');

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', period],
    queryFn: () => dashboardAPI.getSalesAnalytics(period).then((r) => r.data.data),
  });

  const barData = {
    labels: data?.salesData?.map((d) => d.date) || [],
    datasets: [
      {
        label: 'Orders',
        data: data?.salesData?.map((d) => Number(d.orders)) || [],
        backgroundColor: '#0D1B5E',      /* Navy bars */
        borderRadius: 6,
        yAxisID: 'y',
      },
      {
        label: 'Revenue (₦)',
        data: data?.salesData?.map((d) => Number(d.revenue)) || [],
        backgroundColor: 'rgba(0,174,239,0.15)',
        borderColor: '#00AEEF',          /* Cyan line */
        borderWidth: 2,
        borderRadius: 6,
        yAxisID: 'y1',
        type: 'line',
        tension: 0.4,
        pointBackgroundColor: '#00AEEF',
      },
    ],
  };

  const statusLabels = data?.statusBreakdown?.map((s) => s.status?.replace(/_/g, ' ')) || [];
  const statusCounts = data?.statusBreakdown?.map((s) => Number(s.count)) || [];

  const doughnutData = {
    labels: statusLabels,
    datasets: [{
      data: statusCounts,
      backgroundColor: statusLabels.map((s) => STATUS_COLORS[s.replace(/ /g, '_')] || '#94A3B8'),
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex gap-2">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
            style={
              period === p
                ? { backgroundColor: '#0D1B5E', color: '#FFFFFF' }
                : { backgroundColor: '#FFFFFF', color: '#4A5578', border: '1.5px solid #DDE2F0' }
            }
          >
            This {p}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar + Line */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold" style={{ color: '#0D1B5E' }}>Orders & Revenue</h2>
              <p className="text-xs text-slate-400 mt-0.5 capitalize">{period}ly breakdown</p>
            </div>
          </div>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full rounded-2xl animate-pulse" style={{ backgroundColor: '#E8ECF8' }} />
            ) : data?.salesData?.length > 0 ? (
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y:  { type: 'linear', position: 'left',  beginAtZero: true, ticks: { color: '#8A93B2' }, grid: { color: '#EDF0F8' } },
                    y1: { type: 'linear', position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, ticks: { color: '#8A93B2' } },
                    x:  { ticks: { color: '#8A93B2' }, grid: { display: false } },
                  },
                  plugins: { legend: { position: 'top', labels: { color: '#4A5578', font: { size: 12 } } } },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                No data for this period
              </div>
            )}
          </div>
        </div>

        {/* Doughnut */}
        <div className="card">
          <h2 className="font-bold mb-4" style={{ color: '#0D1B5E' }}>Orders by Status</h2>
          <div className="h-64 flex items-center justify-center">
            {isLoading ? (
              <div className="w-48 h-48 rounded-full animate-pulse" style={{ backgroundColor: '#E8ECF8' }} />
            ) : statusCounts.length > 0 ? (
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { font: { size: 11 }, padding: 8, color: '#4A5578' },
                    },
                  },
                  cutout: '68%',
                }}
              />
            ) : (
              <p className="text-slate-400 text-sm">No order data</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary tiles */}
      {data?.statusBreakdown?.length > 0 && (
        <div className="card">
          <h2 className="font-bold mb-4" style={{ color: '#0D1B5E' }}>Status Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.statusBreakdown.map((item) => (
              <div
                key={item.status}
                className="text-center p-4 rounded-2xl border"
                style={{ backgroundColor: '#F4F6FB', borderColor: '#EDF0F8' }}
              >
                <p className="text-2xl font-black" style={{ color: '#0D1B5E' }}>{item.count}</p>
                <p className="text-xs mt-1 capitalize font-medium" style={{ color: '#8A93B2' }}>
                  {item.status?.replace(/_/g, ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
