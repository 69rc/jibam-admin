import { useQuery } from '@tanstack/react-query';
import {
  MdPeople, MdShoppingCart, MdInventory,
  MdAttachMoney, MdTrendingUp, MdPendingActions,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import StatsCard from '../../components/common/StatsCard';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const statusBadge = {
  pending:          'badge-warning',
  paid:             'badge-cyan',
  processing:       'badge-info',
  ready:            'badge-info',
  out_for_delivery: 'badge-info',
  delivered:        'badge-success',
  cancelled:        'badge-danger',
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getStats().then((r) => r.data.data),
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['analytics', 'month'],
    queryFn: () => dashboardAPI.getSalesAnalytics('month').then((r) => r.data.data),
  });

  const stats = data?.stats;

  const chartData = {
    labels: analyticsData?.salesData?.map((d) => d.date) || [],
    datasets: [
      {
        label: 'Revenue (₦)',
        data: analyticsData?.salesData?.map((d) => Number(d.revenue)) || [],
        borderColor: '#00AEEF',          /* Cyan line */
        backgroundColor: 'rgba(0,174,239,0.08)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#0D1B5E', /* Navy points */
        borderWidth: 2.5,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* ── Stats Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard title="Total Revenue"   value={`₦${Number(stats?.totalRevenue   || 0).toLocaleString()}`} icon={MdAttachMoney}    color="navy" />
        <StatsCard title="Monthly Revenue" value={`₦${Number(stats?.monthlyRevenue || 0).toLocaleString()}`} icon={MdTrendingUp}     color="cyan" />
        <StatsCard title="Total Orders"    value={(stats?.totalOrders    || 0).toLocaleString()}             icon={MdShoppingCart}   color="purple" />
        <StatsCard title="Pending Orders"  value={stats?.pendingOrders  || 0}                               icon={MdPendingActions} color="yellow" />
        <StatsCard title="Customers"       value={(stats?.totalUsers     || 0).toLocaleString()}             icon={MdPeople}         color="orange" />
        <StatsCard title="Active Products" value={(stats?.totalProducts  || 0).toLocaleString()}             icon={MdInventory}      color="green" />
      </div>

      {/* ── Revenue Chart ───────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-lg" style={{ color: '#0D1B5E' }}>Revenue — This Month</h2>
            <p className="text-xs text-slate-400 mt-0.5">Daily revenue breakdown</p>
          </div>
          <span className="badge-cyan">Live</span>
        </div>
        <div className="h-64">
          {analyticsData?.salesData?.length > 0 ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { color: '#8A93B2' }, grid: { color: '#EDF0F8' } },
                  x: { ticks: { color: '#8A93B2' }, grid: { display: false } },
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              No revenue data yet
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold" style={{ color: '#0D1B5E' }}>Recent Orders</h2>
            <Link to="/orders" className="text-sm font-semibold hover:underline" style={{ color: '#00AEEF' }}>
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl animate-pulse" style={{ backgroundColor: '#E8ECF8' }} />
              ))}
            </div>
          ) : data?.recentOrders?.length > 0 ? (
            <div className="space-y-2">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#0D1B5E' }}>#{order.orderNumber}</p>
                    <p className="text-xs text-slate-400">{order.user?.fullname}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#0D1B5E' }}>
                      ₦{Number(order.total).toLocaleString()}
                    </p>
                    <span className={statusBadge[order.status] || 'badge-gray'}>
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">No orders yet</p>
          )}
        </div>

        {/* Low Stock */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold" style={{ color: '#0D1B5E' }}>⚠️ Low Stock Alert</h2>
            <Link to="/products" className="text-sm font-semibold hover:underline" style={{ color: '#00AEEF' }}>
              Manage →
            </Link>
          </div>
          {data?.lowStockProducts?.length > 0 ? (
            <div className="space-y-2">
              {data.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{ backgroundColor: '#FFF5F5', borderColor: '#FECACA' }}
                >
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm"
                      style={{ backgroundColor: '#E8ECF8', color: '#0D1B5E' }}>
                      💊
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#0D1B5E' }}>{product.name}</p>
                    <p className="text-xs text-red-500 font-semibold">{product.stock} units remaining</p>
                  </div>
                  <span className={product.stock <= 5 ? 'badge-danger' : 'badge-warning'}>
                    {product.stock <= 5 ? 'Critical' : 'Low'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: '#8A93B2' }}>
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm">All products are well-stocked</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
