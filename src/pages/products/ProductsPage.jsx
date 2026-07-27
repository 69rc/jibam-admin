import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { productAPI, categoryAPI } from '../../services/api';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { useDebounce } from '../../hooks/useDebounce';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, debouncedSearch, categoryFilter],
    queryFn: () =>
      productAPI.getAll({ page, limit: 15, search: debouncedSearch, categoryId: categoryFilter || undefined })
        .then((r) => r.data),
  });

  const { data: catData } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => categoryAPI.getAll({ limit: 100 }).then((r) => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productAPI.delete(id),
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries(['products']);
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (val, row) => (
        <img
          src={val || `https://via.placeholder.com/48x48/E8ECF8/0D1B5E?text=${encodeURIComponent(row.name?.[0] || '+')}`}
          alt={row.name}
          className="w-12 h-12 rounded-xl object-cover border"
          style={{ borderColor: '#EDF0F8' }}
        />
      ),
    },
    {
      key: 'name',
      label: 'Product Name',
      render: (v) => <span className="font-semibold" style={{ color: '#0D1B5E' }}>{v}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      render: (v) => v?.name
        ? <span className="badge-navy">{v.name}</span>
        : <span className="badge-gray">—</span>,
    },
    {
      key: 'price',
      label: 'Price',
      render: (v) => (
        <span className="font-bold" style={{ color: '#0D1B5E' }}>
          ₦{Number(v).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (v) => (
        <span className={v <= 5 ? 'badge-danger' : v <= 20 ? 'badge-warning' : 'badge-success'}>
          {v} units
        </span>
      ),
    },
    {
      key: 'prescriptionRequired',
      label: 'Rx',
      render: (v) => v
        ? <span className="badge-warning">Required</span>
        : <span className="badge-gray">No</span>,
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (v) => v
        ? <span className="badge-success">Active</span>
        : <span className="badge-danger">Inactive</span>,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (v) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/products/${v}/edit`}
            className="p-1.5 rounded-lg transition-colors hover:bg-blue-50"
            style={{ color: '#1A2E8A' }}
            title="Edit"
          >
            <MdEdit className="text-lg" />
          </Link>
          <button
            onClick={() => setDeleteTarget(v)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <MdDelete className="text-lg" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:max-w-xl">
          <SearchInput
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            placeholder="Search products…"
          />
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="input w-full sm:w-48"
          >
            <option value="">All Categories</option>
            {catData?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <Link
          to="/products/new"
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <MdAdd className="text-xl" /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <Table
          columns={columns}
          data={data?.data}
          loading={isLoading}
          emptyText="No products found"
        />
        <Pagination pagination={data?.pagination} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget)}
        loading={deleteMutation.isPending}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
