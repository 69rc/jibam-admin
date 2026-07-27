import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdArrowBack, MdLocalShipping } from 'react-icons/md';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ORDER_STATUSES = [
  'pending', 'paid', 'processing', 'ready',
  'out_for_delivery', 'delivered', 'cancelled',
];

const statusStyle = {
  pending:          { bg: '#FEF9C3', text: '#854D0E', border: '#FEF08A' },
  paid:             { bg: '#E0F5FD', text: '#0090CC', border: '#B3E7FA' },
  processing:       { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' },
  ready:            { bg: '#E0F2FE', text: '#075985', border: '#BAE6FD' },
  out_for_delivery: { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA' },
  delivered:        { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' },
  cancelled:        { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderAPI.getById(id).then((r) => r.data.data),
    onSuccess: (data) => setNewStatus(data.status),
  });

  const updateMutation = useMutation({
    mutationFn: ({ status }) => orderAPI.updateStatus(id, { status }),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries(['order', id]);
      queryClient.invalidateQueries(['orders']);
    },
    onError: () => toast.error('Failed to update status'),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ backgroundColor: '#E8ECF8' }} />
        ))}
      </div>
    );
  }

  if (!order) return <p className="text-slate-500">Order not found</p>;

  const ss = statusStyle[order.status] || statusStyle.pending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          style={{ color: '#0D1B5E' }}
        >
          <MdArrowBack className="text-xl" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold" style={{ color: '#0D1B5E' }}>
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-slate-400">
            {new Date(order.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <span
          className="px-3 py-1.5 rounded-full text-sm font-bold border"
          style={{ backgroundColor: ss.bg, color: ss.text, borderColor: ss.border }}
        >
          {order.status?.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — items + status update */}
        <div className="lg:col-span-2 space-y-5">

          {/* Order Items */}
          <div className="card">
            <h2 className="font-bold mb-4" style={{ color: '#0D1B5E' }}>Order Items</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-xl"
                  style={{ backgroundColor: '#F4F6FB' }}
                >
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: '#E8ECF8' }}
                    >
                      💊
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: '#0D1B5E' }}>
                      {item.productName}
                    </p>
                    <p className="text-xs text-slate-400">
                      Qty: {item.quantity} × ₦{Number(item.price).toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-sm" style={{ color: '#0D1B5E' }}>
                    ₦{Number(item.total).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: '#EDF0F8' }}>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>₦{Number(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Delivery Fee</span>
                <span>₦{Number(order.deliveryFee).toLocaleString()}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm" style={{ color: '#00AEEF' }}>
                  <span>Discount ({order.promoCode})</span>
                  <span>-₦{Number(order.discount).toLocaleString()}</span>
                </div>
              )}
              <div
                className="flex justify-between font-bold text-base pt-2 border-t"
                style={{ borderColor: '#EDF0F8', color: '#0D1B5E' }}
              >
                <span>Total</span>
                <span>₦{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <MdLocalShipping className="text-xl" style={{ color: '#00AEEF' }} />
              <h2 className="font-bold" style={{ color: '#0D1B5E' }}>Update Status</h2>
            </div>
            <div className="flex gap-3">
              <select
                value={newStatus || order.status}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input flex-1"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
              <button
                onClick={() => updateMutation.mutate({ status: newStatus || order.status })}
                disabled={updateMutation.isPending}
                className="btn-primary whitespace-nowrap"
              >
                {updateMutation.isPending ? 'Updating…' : 'Update'}
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="card">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3 text-slate-400">Customer</h2>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: '#00AEEF' }}
              >
                {order.user?.fullname?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#0D1B5E' }}>{order.user?.fullname}</p>
                <p className="text-xs text-slate-400">{order.user?.email}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">{order.user?.phone}</p>
          </div>

          {/* Delivery */}
          <div className="card">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3 text-slate-400">Delivery</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{order.deliveryAddress}</p>
            <p className="text-sm text-slate-500 mt-2">📞 {order.deliveryPhone}</p>
            {order.deliveryInstructions && (
              <p
                className="text-xs text-slate-500 mt-2 p-2 rounded-lg"
                style={{ backgroundColor: '#F4F6FB' }}
              >
                {order.deliveryInstructions}
              </p>
            )}
          </div>

          {/* Payment */}
          <div className="card">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3 text-slate-400">Payment</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className={order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Method</span>
                <span className="capitalize font-medium" style={{ color: '#0D1B5E' }}>
                  {order.paymentMethod}
                </span>
              </div>
              {order.paymentReference && (
                <div className="flex justify-between text-sm gap-2">
                  <span className="text-slate-500">Ref</span>
                  <span className="font-mono text-xs break-all text-right" style={{ color: '#0D1B5E' }}>
                    {order.paymentReference}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
