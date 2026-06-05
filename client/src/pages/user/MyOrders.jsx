import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrdersAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';

const statusColors = { pending: 'warning', processing: 'primary', shipped: 'cyan', delivered: 'success', cancelled: 'danger' };
const statusIcons = { pending: 'bi-clock', processing: 'bi-gear', shipped: 'bi-truck', delivered: 'bi-check-circle', cancelled: 'bi-x-circle' };

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getMyOrdersAPI().then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-bag-check me-2"></i>My Orders</h1>
          <p>{orders.length} total orders</p>
        </div>
      </div>
      <div className="container pb-5">
        {/* Filter tabs */}
        <div className="d-flex gap-2 flex-wrap mb-4">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              background: filter === s ? 'var(--primary)' : 'var(--card-bg)',
              border: `1px solid ${filter === s ? 'var(--primary)' : 'var(--border)'}`,
              color: filter === s ? '#fff' : 'var(--text-secondary)',
              padding: '8px 18px', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, fontFamily: 'Outfit', fontSize: '13px', textTransform: 'capitalize'
            }}>{s}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-bag-x"></i>
            <h3>No Orders Found</h3>
            <p>You haven't placed any orders yet</p>
            <Link to="/products" className="btn-primary-custom">Start Shopping</Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filtered.map(order => (
              <div key={order._id} className="card-custom" style={{ padding: '20px' }}>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Order ID</div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>#{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className={`badge-${statusColors[order.orderStatus] || 'primary'} d-flex align-items-center gap-1`} style={{ padding: '8px 16px', fontSize: '13px' }}>
                    <i className={`bi ${statusIcons[order.orderStatus]}`}></i>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </div>
                </div>

                <div className="d-flex gap-3 mt-3 flex-wrap" style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={item.image || `https://picsum.photos/seed/${item.product}/60/60`} style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} alt="" />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && <div style={{ alignSelf: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>+{order.items.length - 3} more</div>}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total: </span>
                    <strong style={{ fontSize: '16px' }}>₹{order.totalAmount.toLocaleString()}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>({order.paymentMethod})</span>
                  </div>
                  <Link to={`/orders/${order._id}`} className="btn-outline-custom" style={{ padding: '8px 20px', fontSize: '13px' }}>
                    View Details <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
