import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { adminGetOrdersAPI, adminUpdateOrderStatusAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: 'warning', processing: 'primary', shipped: 'cyan', delivered: 'success', cancelled: 'danger' };

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await adminGetOrdersAPI({ status: statusFilter, page });
      setOrders(data.orders);
      setPages(data.pages);
      setTotal(data.total);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, page]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await adminUpdateOrderStatusAPI(orderId, { orderStatus: newStatus });
      toast.success(`Order updated to ${newStatus}`);
      fetchOrders();
    } catch { toast.error('Failed to update status'); } finally { setUpdating(null); }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 style={{ fontWeight: 800, margin: 0 }}>Manage Orders</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>{total} total orders</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {['', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
            background: statusFilter === s ? 'var(--primary)' : 'var(--card-bg)',
            border: `1px solid ${statusFilter === s ? 'var(--primary)' : 'var(--border)'}`,
            color: statusFilter === s ? '#fff' : 'var(--text-secondary)',
            padding: '8px 16px', borderRadius: '50px', cursor: 'pointer',
            fontWeight: 600, fontFamily: 'Outfit', fontSize: '13px', textTransform: 'capitalize',
          }}>{s || 'All'}</button>
        ))}
      </div>

      <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="p-4"><Spinner /></div> : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <i className="bi bi-receipt" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}></i>
            No orders found
          </div>
        ) : (
          <table className="table-custom">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <>
                  <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>#{order._id.slice(-8).toUpperCase()}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>{order.user?.name || 'Guest / Deleted User'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.user?.email || 'N/A'}</div>
                    </td>
                    <td style={{ fontSize: '14px' }}>{order.items?.length} item(s)</td>
                    <td style={{ fontWeight: 700 }}>₹{order.totalAmount?.toLocaleString()}</td>
                    <td>
                      <span className={`badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>{order.paymentMethod}</span>
                    </td>
                    <td>
                      <span className={`badge-${STATUS_COLORS[order.orderStatus] || 'primary'}`} style={{ textTransform: 'capitalize' }}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <select
                        className="form-control-custom"
                        style={{ padding: '6px 10px', fontSize: '12px', width: 'auto' }}
                        value={order.orderStatus}
                        disabled={updating === order._id || order.orderStatus === 'cancelled'}
                        onChange={e => handleStatusUpdate(order._id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expanded === order._id && (
                    <tr>
                      <td colSpan="7" style={{ background: 'var(--dark-3)', padding: '20px' }}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Items</div>
                            {order.items?.map((item, i) => (
                              <div key={i} className="d-flex align-items-center gap-2 mb-2">
                                <img src={item.image || `https://picsum.photos/seed/${item.product}/50/50`} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} alt="" />
                                <div style={{ flex: 1, fontSize: '13px' }}>
                                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                                  <div style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="col-md-6">
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Shipping Address</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                              <strong>{order.shippingAddress?.fullName}</strong><br />
                              {order.shippingAddress?.phone}<br />
                              {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                              {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="pagination-custom mt-4">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><i className="bi bi-chevron-left"></i></button>
          {[...Array(pages)].map((_, i) => (
            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button className="page-btn" disabled={page === pages} onClick={() => setPage(p => p + 1)}><i className="bi bi-chevron-right"></i></button>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageOrders;
