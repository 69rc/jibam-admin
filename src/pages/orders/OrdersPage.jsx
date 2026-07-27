import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MdVisibility } from 'react-icons/md';
import { orderAPI } from '../../services/api';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';
import { useDebounce } from '../../hooks/useDebounce';

const STATUS_OPTIONS = [
  '', 'pending', 'paid', 'processing', 'ready',
  'out_for_delivery', 'delivered', 'cancelled',
];

const statusBadge = (status) => ({
  pending:          'badge-warning',
  paid:             'badge-cyan',
  processing:       'badge-info',
  ready:            'badge-info',
  out_for_delivery: 'badge-info',
  delivered:        'badge-success',
  cancelled:        'badge-danger',
}[status] || 'badge-gray');

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, debouncedSearch, statusFilter],
    queryFn: () =>
      orderAPI.getAll({
        page, limit: 15,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
      }).then((r) => r.data),
  });

  const columns = [
    {
      key: 'orderNumber',
      label: 'Order #',
      render: (v) => (
        <span className="font-mono font-bold" style={{ color: '#0D1B5E' }}>#{v}</span>
      ),
    },
    {
      key: 'user',
      label: 'Customer',
      render: (v) => (
        <div>
          <p className="font-semibold" style={{ color: '#0D1B5E' }}>{v?.fullname || '—'}</p>
          <p className="text-xs text-slate-400">{v?.email}</p>
        </div>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (v) => (
        <span className="font-bold" style={{ color: '#0D1B5E' }}>
          ₦{Number(v).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (v) => (
        <span className={statusBadge(v)}>{v?.replace(/_/g, ' ')}</span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (v) => (
        <span className={v === 'paid' ? 'badge-success' : 'badge-warning'}>{v}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (v) => new Date(v).toLocaleDateString('en-NG', {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (v) => (
        <Link
          to={`/orders/${v}`}
          className="p-1.5 rounded-lg transition-colors inline-flex hover:bg-slate-100"
          style={{ color: '#00AEEF' }}
        >
          <MdVisibility className="text-lg" />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by customer name or email…"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input w-full sm:w-52"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s ? s.replace(/_/g, ' ') : 'All Statuses'}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <Table
          columns={columns}
          data={data?.data}
          loading={isLoading}
          emptyText="No orders found"
        />
        <Pagination pagination={data?.pagination} onPageChange={setPage} />
      </div>
    </div>
  );
}
