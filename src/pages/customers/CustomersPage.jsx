import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdBlock, MdCheckCircle } from 'react-icons/md';
import { customerAPI } from '../../services/api';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [toggleTarget, setToggleTarget] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, debouncedSearch],
    queryFn: () =>
      customerAPI.getAll({ page, limit: 15, role: 'customer', search: debouncedSearch || undefined })
        .then((r) => r.data),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => customerAPI.toggleStatus(id),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(['customers']);
      setToggleTarget(null);
    },
    onError: () => toast.error('Failed to update customer status'),
  });

  const columns = [
    {
      key: 'fullname',
      label: 'Customer',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <img src={row.avatar} alt={v} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: '#00AEEF' }}
            >
              {v?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm" style={{ color: '#0D1B5E' }}>{v}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', render: (v) => v || '—' },
    {
      key: 'isEmailVerified',
      label: 'Email Verified',
      render: (v) => v
        ? <span className="badge-success">Verified</span>
        : <span className="badge-warning">Pending</span>,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (v) => v
        ? <span className="badge-success">Active</span>
        : <span className="badge-danger">Blocked</span>,
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (v) => new Date(v).toLocaleDateString('en-NG', {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (v, row) => (
        <button
          onClick={() => setToggleTarget(row)}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: row.isActive ? '#EF4444' : '#10B981' }}
          title={row.isActive ? 'Block customer' : 'Activate customer'}
        >
          {row.isActive
            ? <MdBlock className="text-lg" />
            : <MdCheckCircle className="text-lg" />
          }
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Search by name, email or phone…"
      />

      <div className="card p-0 overflow-hidden">
        <Table
          columns={columns}
          data={data?.data}
          loading={isLoading}
          emptyText="No customers found"
        />
        <Pagination pagination={data?.pagination} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={() => toggleMutation.mutate(toggleTarget?.id)}
        loading={toggleMutation.isPending}
        title={toggleTarget?.isActive ? 'Block Customer' : 'Activate Customer'}
        message={`Are you sure you want to ${toggleTarget?.isActive ? 'block' : 'activate'} ${toggleTarget?.fullname}?`}
        confirmText={toggleTarget?.isActive ? 'Block' : 'Activate'}
      />
    </div>
  );
}
