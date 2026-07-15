import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { placeOrderAPI } from '../../services/api';
import { toast } from 'react-toastify';

const steps = ['Address', 'Payment', 'Confirm'];

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ fullName: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const items = cart.items || [];
  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  const handleAddressSubmit = (e) => { e.preventDefault(); setStep(1); };
  const handlePaymentSubmit = (e) => { e.preventDefault(); setStep(2); };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await placeOrderAPI({ shippingAddress: address, paymentMethod });
      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setPlacing(false); }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
        </div>
      </div>
      <div className="container pb-5">
        {/* Steps */}
        <div className="checkout-steps mb-5">
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div className={`checkout-step ${step === i ? 'active' : step > i ? 'done' : ''}`}>
                <div className="checkout-step-num">
                  {step > i ? <i className="bi bi-check-lg"></i> : i + 1}
                </div>
                <span className="checkout-step-label">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`checkout-connector ${step > i ? 'done' : ''}`}></div>}
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="card-custom">
                <h5 style={{ fontWeight: 700, marginBottom: '24px' }}><i className="bi bi-geo-alt me-2"></i>Delivery Address</h5>
                <form onSubmit={handleAddressSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Full Name *</label>
                      <input className="form-control-custom" value={address.fullName} onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} required />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Phone *</label>
                      <input className="form-control-custom" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} required />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Street Address *</label>
                      <input className="form-control-custom" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>City *</label>
                      <input className="form-control-custom" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>State *</label>
                      <input className="form-control-custom" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Pincode *</label>
                      <input className="form-control-custom" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} required />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary-custom mt-4" style={{ padding: '12px 32px' }}>
                    Continue to Payment <i className="bi bi-arrow-right"></i>
                  </button>
                </form>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="card-custom">
                <h5 style={{ fontWeight: 700, marginBottom: '24px' }}><i className="bi bi-credit-card me-2"></i>Payment Method</h5>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="d-flex flex-column gap-3 mb-4">
                    {[['COD', 'bi-cash-coin', 'Cash on Delivery', 'Pay when your order arrives'], ['Card', 'bi-credit-card', 'Credit / Debit Card', 'Visa, Mastercard, RuPay'], ['UPI', 'bi-phone', 'UPI Payment', 'GPay, PhonePe, BHIM UPI']].map(([val, icon, label, sub]) => (
                      <div key={val} onClick={() => setPaymentMethod(val)} style={{ background: paymentMethod === val ? 'rgba(108,62,244,0.1)' : 'var(--dark-3)', border: `1px solid ${paymentMethod === val ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: paymentMethod === val ? 'rgba(108,62,244,0.2)' : 'var(--dark-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: paymentMethod === val ? 'var(--primary-light)' : 'var(--text-muted)' }}>
                          <i className={`bi ${icon}`}></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{label}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{sub}</div>
                        </div>
                        {paymentMethod === val && <i className="bi bi-check-circle-fill ms-auto" style={{ color: 'var(--primary)', fontSize: '20px' }}></i>}
                      </div>
                    ))}
                  </div>
                  {paymentMethod === 'Card' && (
                    <div className="row g-3 mb-4">
                      <div className="col-12">
                        <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Card Number</label>
                        <input className="form-control-custom" placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={e => setCardDetails(c => ({ ...c, number: e.target.value }))} required />
                      </div>
                      <div className="col-12">
                        <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Name on Card</label>
                        <input className="form-control-custom" placeholder="John Doe" value={cardDetails.name} onChange={e => setCardDetails(c => ({ ...c, name: e.target.value }))} required />
                      </div>
                      <div className="col-md-6">
                        <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Expiry</label>
                        <input className="form-control-custom" placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails(c => ({ ...c, expiry: e.target.value }))} required />
                      </div>
                      <div className="col-md-6">
                        <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>CVV</label>
                        <input className="form-control-custom" placeholder="•••" type="password" maxLength="3" value={cardDetails.cvv} onChange={e => setCardDetails(c => ({ ...c, cvv: e.target.value }))} required />
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'UPI' && (
                    <div className="mb-4">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>UPI ID</label>
                      <input className="form-control-custom" placeholder="yourname@upi" required />
                    </div>
                  )}
                  <div className="d-flex gap-3">
                    <button type="button" className="btn-outline-custom" onClick={() => setStep(0)}>
                      <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <button type="submit" className="btn-primary-custom">
                      Review Order <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div className="card-custom">
                <h5 style={{ fontWeight: 700, marginBottom: '24px' }}><i className="bi bi-check-circle me-2"></i>Order Confirmation</h5>
                <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--dark-3)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Delivery to:</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {address.fullName} • {address.phone}<br />
                    {address.street}, {address.city}, {address.state} - {address.pincode}
                  </div>
                </div>
                <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--dark-3)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Payment:</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {paymentMethod === 'COD' ? '💵 Cash on Delivery' : paymentMethod === 'Card' ? '💳 Card Payment' : '📱 UPI Payment'}
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <button className="btn-outline-custom" onClick={() => setStep(1)}><i className="bi bi-arrow-left"></i> Back</button>
                  <button className="btn-primary-custom" onClick={handlePlaceOrder} disabled={placing} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
                    {placing ? 'Placing Order...' : <><i className="bi bi-bag-check"></i> Place Order — ₹{total.toLocaleString()}</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="col-lg-5">
            <div className="card-custom" style={{ position: 'sticky', top: '80px' }}>
              <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Order Summary</h5>
              <div className="d-flex flex-column gap-3 mb-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {items.map(item => (
                  <div key={item.product._id} className="d-flex align-items-center gap-3">
                    <img src={item.product.images?.[0] || `https://picsum.photos/seed/${item.product._id}/100/100`} style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} alt="" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.product.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                {[['Subtotal', `₹${subtotal.toLocaleString()}`], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ['Tax (5%)', `₹${tax}`]].map(([l, v]) => (
                  <div key={l} className="d-flex justify-content-between mb-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span>{l}</span><span>{v}</span>
                  </div>
                ))}
                <div className="d-flex justify-content-between mt-3" style={{ fontWeight: 800, fontSize: '18px' }}>
                  <span>Total</span><span className="gradient-text">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
