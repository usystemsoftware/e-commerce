import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderByIdAPI, cancelOrderAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getOrderByIdAPI(id).then(r => setOrder(r.data)).catch(() => navigate('/orders')).finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await cancelOrderAPI(id, 'Cancelled by user');
      const { data } = await getOrderByIdAPI(id);
      setOrder(data);
      toast.success('Order cancelled');
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel'); }
    finally { setCancelling(false); }
  };

  if (loading) return <Spinner />;
  if (!order) return null;

  const isCancelled = order.orderStatus === 'cancelled';
  const currentStep = statusSteps.indexOf(order.orderStatus);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontSize: '14px' }}>
              <i className="bi bi-arrow-left me-1"></i>Back to Orders
            </button>
            <h1 style={{ margin: 0 }}>Order #{order._id.slice(-8).toUpperCase()}</h1>
          </div>
          <p style={{ marginTop: '8px' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="container pb-5">
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Status Timeline */}
            {!isCancelled && (
              <div className="card-custom mb-4">
                <h5 style={{ fontWeight: 700, marginBottom: '24px' }}><i className="bi bi-map me-2"></i>Order Status</h5>
                <div className="order-timeline">
                  {statusSteps.map((s, i) => {
                    const done = currentStep > i;
                    const active = currentStep === i;
                    return (
                      <div key={s} className="timeline-step">
                        <div className="timeline-line-wrap">
                          <div className={`timeline-dot ${done ? 'done' : active ? 'active' : 'pending'}`}>
                            <i className={`bi ${done ? 'bi-check-lg' : active ? 'bi-circle-fill' : 'bi-circle'}`}></i>
                          </div>
                          {i < statusSteps.length - 1 && <div className={`timeline-connector ${done ? 'done' : ''}`}></div>}
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-label" style={{ textTransform: 'capitalize', color: done || active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</div>
                          {done && <div className="timeline-sub">Completed</div>}
                          {active && <div className="timeline-sub" style={{ color: 'var(--primary-light)' }}>In Progress</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {order.trackingNumber && (
                  <div style={{ marginTop: '16px', padding: '12px', background: 'var(--dark-3)', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}>
                    <i className="bi bi-truck me-2" style={{ color: 'var(--primary-light)' }}></i>
                    Tracking: <strong>{order.trackingNumber}</strong>
                  </div>
                )}
              </div>
            )}
            {isCancelled && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '24px' }}>
                <i className="bi bi-x-circle me-2" style={{ color: 'var(--danger)' }}></i>
                <strong>Order Cancelled</strong>
                {order.cancelReason && <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Reason: {order.cancelReason}</div>}
              </div>
            )}

            {/* Items */}
            <div className="card-custom mb-4">
              <h5 style={{ fontWeight: 700, marginBottom: '20px' }}><i className="bi bi-box me-2"></i>Items ({order.items.length})</h5>
              <div className="d-flex flex-column gap-3">
                {order.items.map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-3">
                    <img src={item.image || `https://picsum.photos/seed/${item.product}/80/80`} style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} alt="" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price.toLocaleString()}</div>
                    </div>
                    <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="card-custom">
              <h5 style={{ fontWeight: 700, marginBottom: '16px' }}><i className="bi bi-geo-alt me-2"></i>Delivery Address</h5>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.8' }}>
                <strong>{order.shippingAddress?.fullName}</strong><br />
                {order.shippingAddress?.phone}<br />
                {order.shippingAddress?.street}, {order.shippingAddress?.city},<br />
                {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="col-lg-4">
            <div className="card-custom mb-4">
              <h5 style={{ fontWeight: 700, marginBottom: '16px' }}>Payment Summary</h5>
              {[['Items', `₹${order.itemsPrice?.toLocaleString()}`], ['Shipping', order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`], ['Tax', `₹${order.taxPrice?.toLocaleString()}`]].map(([l, v]) => (
                <div key={l} className="d-flex justify-content-between mb-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
              <div className="d-flex justify-content-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border)', fontWeight: 800, fontSize: '18px' }}>
                <span>Total</span><span className="gradient-text">₹{order.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="mt-3" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Payment: {order.paymentMethod} —
                <span className={`ms-1 badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>{order.paymentStatus}</span>
              </div>
            </div>
            {!isCancelled && !['shipped', 'delivered'].includes(order.orderStatus) && (
              <button className="w-100" onClick={handleCancel} disabled={cancelling} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontFamily: 'Outfit', fontSize: '14px' }}>
                {cancelling ? 'Cancelling...' : <><i className="bi bi-x-circle me-2"></i>Cancel Order</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
